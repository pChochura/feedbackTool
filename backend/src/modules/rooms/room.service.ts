import {
	Injectable,
	NotFoundException,
	ConflictException,
	BadRequestException,
	ForbiddenException,
	HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { generateId } from '../../common';
import { Session, SessionPhase } from '../sessions/entities/session.entity';
import { List } from '../lists/entities/list.entity';
import { User } from '../users/entities/user.entity';
import { SetRoomReadyDto } from './dto/set-room-ready.dto';
import { SubmitNoteDto } from './dto/submit-note.dto';
import { Note } from '../notes/entities/note.entity';
import { RemoveNoteDto } from './dto/remove-note.dto';
import { SocketGateway } from '../sockets/socket.gateway';

@Injectable()
export class RoomService {
	constructor(
		@InjectRepository(Room) private roomRepository: Repository<Room>,
		private readonly socketGateway: SocketGateway
	) {}

	async create(createRoomDto: CreateRoomDto): Promise<Room> {
		const id = generateId(createRoomDto.seed);
		if (await this.roomRepository.findOne(id)) {
			throw new ConflictException('Room for this user already exist');
		}

		const session = await Session.findOne({
			where: {
				addLink: createRoomDto.addLink,
			},
		});
		if (!session) {
			throw new NotFoundException('Session not found');
		}

		if (session.phase !== SessionPhase.CREATION) {
			throw new BadRequestException('This action is now locked');
		}

		const creator = await User.findOne(session.creatorId);
		if (!creator) {
			throw new NotFoundException('User not found');
		}

		const [, existingRoomsCount] = await Room.findAndCount({
			where: { sessionId: session.id },
		});
		if ((creator.premiumSessionsLeft || 0) <= 0 && existingRoomsCount >= 5) {
			// @todo: Add possibility to extend plan while in a session
			// this.socketGateway.roomLimit(session.id, createRoomDto.name);
			throw new HttpException(
				'You have reached the basic plan limit. Wait for the creator to approve',
				423
			);
		}

		const user = await User.findOne(id);
		if (!user) {
			await User.create({ id, sessionId: session.id }).save();
		}

		const rooms = await this.roomRepository.find({
			where: {
				sessionId: session.id,
			},
			relations: ['lists'],
		});
		const listsToSave: List[] = [];

		rooms.forEach((room) => {
			const list = List.create({
				id: generateId(),
				associatedRoomId: id,
				name: createRoomDto.name,
				notes: [],
			});
			listsToSave.push(list);
			room.lists.push(list);
			room.ready = false;
		});
		await this.roomRepository.save(rooms);

		const room = this.roomRepository.create({
			id,
			name: createRoomDto.name,
			sessionId: session.id,
			ready: false,
			lists: rooms.map((room) => {
				const list = List.create({
					id: generateId(),
					associatedRoomId: room.id,
					name: room.name,
					notes: [],
				});
				listsToSave.push(list);
				return list;
			}),
		});

		await this.roomRepository.save(room);
		await List.save(listsToSave);

		this.socketGateway.roomCreated(session.id, room);

		return room;
	}

	async findAllMatching(
		user: User,
		seed: string
	): Promise<Partial<Room & { own: boolean }>[]> {
		const id = generateId(seed);
		const session = await Session.findOne(id);
		const loggedIn = user !== null;

		user =
			(!session && user) ||
			(await User.findOne({
				where: [{ id: session.creatorId }, { id }],
			}));
		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (!(await Session.findOne(user.sessionId))) {
			throw new NotFoundException('Session not found');
		}

		const rooms = await this.roomRepository.find({
			where: {
				sessionId: user.sessionId,
			},
			relations: ['lists', 'lists.notes'],
		});

		return rooms.map((room) => ({
			...room,
			own: room.id === (loggedIn ? user.sessionId : user.id),
		}));
	}

	async findOneMatching(user: User, seed: string): Promise<Room> {
		const id = generateId(seed);
		const room = await this.roomRepository.findOne({
			where: { id: user ? user.sessionId : id },
			relations: ['lists'],
		});

		if (!room) {
			throw new NotFoundException('Room not found');
		}

		if (!(await Session.findOne(room.sessionId))) {
			throw new NotFoundException('Session not found');
		}

		return room;
	}

	async findOne(seed: string, roomId: string): Promise<Room> {
		const id = generateId(seed);
		const room = await this.roomRepository.findOne({
			where: { id: roomId },
			relations: ['lists', 'lists.notes'],
		});

		if (!room) {
			throw new NotFoundException('Room not found');
		}

		if (room.id !== id) {
			throw new ForbiddenException(
				'Only the creator of the room can access it'
			);
		}

		if (!(await Session.findOne(room.sessionId))) {
			throw new NotFoundException('Session not found');
		}

		return room;
	}

	async remove(user: User, seed: string, roomId: string): Promise<Room> {
		const id = generateId(seed);
		const session = await Session.findOne(id);
		if (!session) {
			throw new NotFoundException('Session not found');
		}

		user = user || (await User.findOne(session.creatorId));
		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (session.phase !== SessionPhase.CREATION) {
			throw new BadRequestException('This action is now locked');
		}

		const room = await Room.findOne(roomId, {
			relations: ['lists', 'lists.notes'],
		});
		if (!room) {
			throw new NotFoundException('Room not found');
		}

		const rooms = await Room.find({
			where: {
				sessionId: session.id,
			},
			relations: ['lists', 'lists.notes'],
		});
		const listsToRemove = [
			...rooms.flatMap((_room) =>
				_room.lists.filter((list) => list.associatedRoomId === room.id)
			),
			...room.lists,
		];
		const notesToRemove = [
			...listsToRemove.flatMap((list) => list.notes),
			...room.lists.flatMap((list) => list.notes),
		];

		await Note.remove(notesToRemove);
		await List.remove(listsToRemove);
		await (await User.findOne(room.id)).remove();

		await room.remove();

		this.socketGateway.roomRemoved(session.id, roomId);

		return room;
	}

	async setReady(
		user: User,
		seed: string,
		roomId: string,
		setRoomReadyDto: SetRoomReadyDto
	): Promise<Room> {
		const id = generateId(seed);
		user = user || (await User.findOne(id));
		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (user.id !== roomId && user.id !== user.sessionId) {
			throw new ForbiddenException(
				'Only the creator of the session or room can modify it'
			);
		}

		const session = await Session.findOne(user.sessionId);
		if (session.phase !== SessionPhase.CREATION) {
			throw new BadRequestException('This action is now locked');
		}

		const room = await this.roomRepository.findOne(roomId, {
			relations: ['lists', 'lists.notes'],
		});
		if (!room) {
			throw new NotFoundException('Room not found');
		}

		room.ready = setRoomReadyDto.ready;

		await room.save();

		this.socketGateway.roomChanged(session.id, room);

		return room;
	}

	async sumbitNote(
		seed: string,
		roomId: string,
		submitNoteDto: SubmitNoteDto
	): Promise<Room> {
		const id = generateId(seed);
		const user = await User.findOne(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (user.id !== roomId) {
			throw new ForbiddenException('Only the creator of room can modify it');
		}

		const session = await Session.findOne(user.sessionId);
		if (session.phase !== SessionPhase.CREATION) {
			throw new BadRequestException('This action is now locked');
		}

		const room = await this.roomRepository.findOne(roomId, {
			relations: ['lists', 'lists.notes'],
		});
		if (!room) {
			throw new NotFoundException('Room not found');
		}

		if (room.ready) {
			throw new BadRequestException('This action is now locked');
		}

		const list = room.lists.find((list) => list.id === submitNoteDto.listId);
		if (!list) {
			throw new NotFoundException('List not found');
		}

		const note = list.notes.find((note) => note.id === submitNoteDto.id);
		if (submitNoteDto.id && note) {
			note.content = submitNoteDto.note;
			note.positive = submitNoteDto.positive;
			await note.save();
		} else {
			list.notes.push(
				Note.create({
					id: generateId(),
					content: submitNoteDto.note,
					positive: submitNoteDto.positive,
				})
			);
		}

		await room.save();

		this.socketGateway.roomChanged(session.id, room);

		return room;
	}

	async removeNote(
		seed: string,
		roomId: string,
		removeNoteDto: RemoveNoteDto
	): Promise<Room> {
		const id = generateId(seed);
		const user = await User.findOne(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (user.id !== roomId) {
			throw new ForbiddenException('Only the creator of room can modify it');
		}

		const session = await Session.findOne(user.sessionId);
		if (session.phase !== SessionPhase.CREATION) {
			throw new BadRequestException('This action is now locked');
		}

		const room = await this.roomRepository.findOne(roomId, {
			relations: ['lists', 'lists.notes'],
		});
		if (!room) {
			throw new NotFoundException('Room not found');
		}

		if (room.ready) {
			throw new BadRequestException('This action is now locked');
		}

		const list = room.lists.find((list) => list.id === removeNoteDto.listId);
		if (!list) {
			throw new NotFoundException('List not found');
		}

		const noteIndex = list.notes.findIndex(
			(note) => note.id === removeNoteDto.id
		);
		if (noteIndex === -1) {
			throw new NotFoundException('Note not found');
		}

		list.notes.splice(noteIndex, 1);
		await list.save();

		this.socketGateway.roomChanged(session.id, room);

		return room;
	}
}
