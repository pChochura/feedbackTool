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
import { generateId, dateComparator } from '../../common';
import { Session, SessionPhase } from '../sessions/entities/session.entity';
import { List } from '../lists/entities/list.entity';
import { User } from '../users/entities/user.entity';
import { SetRoomReadyDto } from './dto/set-room-ready.dto';
import { SubmitNoteDto } from './dto/submit-note.dto';
import { Note } from '../notes/entities/note.entity';
import { RemoveNoteDto } from './dto/remove-note.dto';
import { SocketGateway } from '../sockets/socket.gateway';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class RoomService {
	constructor(
		@InjectRepository(Room) private roomRepository: Repository<Room>,
		private readonly socketGateway: SocketGateway,
		private readonly loggerService: LoggerService
	) {
		this.loggerService.setContext('room.service');
	}

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
		if (!session.premium && existingRoomsCount >= 5) {
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
				createdAt: room.createdAt,
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
					createdAt: room.createdAt,
				});
				listsToSave.push(list);
				return list;
			}),
		});

		await this.roomRepository.save(room);
		await List.save(listsToSave);

		this.loggerService.info('Room created', {
			sessionId: session.id,
			roomId: room.id,
		});

		this.socketGateway.roomCreated(session.id, room);

		return room;
	}

	async findAllMatching(
		user: User,
		seed: string
	): Promise<Partial<Room & { own: boolean }>[]> {
		const id = generateId(seed);
		const session = await Session.findOne(id);
		const loggedIn = !!user;

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

		rooms.sort(dateComparator);

		this.loggerService.info('Found all matching', {
			loggedIn,
			sessionId: user.sessionId,
			roomsIds: rooms.map((room) => room.id),
		});

		return rooms.map((room) => {
			room.lists.sort(dateComparator);
			room.lists.forEach((list) => list.notes.sort(dateComparator));

			return {
				...room,
				own: room.id === (loggedIn ? user.sessionId : user.id),
			};
		});
	}

	async findOneMatching(user: User, seed: string): Promise<Room> {
		const id = generateId(seed);
		const loggedIn = !!user;
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

		this.loggerService.info('Found one matching', {
			loggedIn,
			sessionId: room.sessionId,
			roomId: room.id,
		});

		room.lists.sort(dateComparator);

		return room;
	}

	async findOne(user: User, seed: string, roomId: string): Promise<Room> {
		const id = generateId(seed);
		const loggedIn = !!user;
		const room = await this.roomRepository.findOne({
			where: { id: user ? user.sessionId : id },
			relations: ['lists', 'lists.notes'],
		});

		if (!room) {
			throw new NotFoundException('Room not found');
		}

		if (!(await Session.findOne(room.sessionId))) {
			throw new NotFoundException('Session not found');
		}

		room.lists.sort(dateComparator);
		room.lists.forEach((list) => list.notes.sort(dateComparator));

		this.loggerService.info('Found one', { loggedIn, roomId: roomId });

		return room;
	}

	async remove(user: User, seed: string, roomId: string): Promise<Room> {
		const id = generateId(seed);
		const session = await Session.findOne(id);
		const loggedIn = !!user;
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
		this.loggerService.info('Notes removed', {
			notesIds: notesToRemove.map((note) => note.id),
		});

		await List.remove(listsToRemove);
		this.loggerService.info('Lists removed', {
			listsIds: listsToRemove.map((list) => list.id),
		});

		await (await User.findOne(room.id)).remove();
		this.loggerService.info('User removed', {
			sessionId: session.id,
			userId: room.id,
		});

		await room.remove();
		this.loggerService.info('Room removed', {
			loggedIn,
			sessionId: session.id,
			roomId: room.id,
		});

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
		const loggedIn = !!user;
		user = user || (await User.findOne(id));
		if (!user) {
			throw new NotFoundException('User not found');
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
		this.loggerService.info('Room set ready', {
			loggedIn,
			sessionId: session.id,
			roomId: room.id,
			ready: room.ready,
		});

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

		room.lists.sort(dateComparator);
		room.lists.forEach((list) => list.notes.sort(dateComparator));
		await room.save();
		this.loggerService.info('Note submitted', {
			roomId: room.id,
			userId: user.id,
		});

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
		room.lists.sort(dateComparator);
		room.lists.forEach((list) => list.notes.sort(dateComparator));
		await list.save();
		this.loggerService.info('Note removed', {
			roomId: room.id,
			userId: user.id,
			noteId: removeNoteDto.id,
		});

		this.socketGateway.roomChanged(session.id, room);

		return room;
	}
}
