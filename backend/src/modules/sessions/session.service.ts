import {
	Injectable,
	BadRequestException,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session, SessionPhase } from './entities/session.entity';
import { Repository, In } from 'typeorm';
import { CreateSessionDto } from './dto/create-session.dto';
import { generateId } from '../../common';
import { User } from '../users/entities/user.entity';
import { Room } from '../rooms/entities/room.entity';
import { List } from '../lists/entities/list.entity';
import { Note } from '../notes/entities/note.entity';

@Injectable()
export class SessionService {
	constructor(
		@InjectRepository(Session) private sessionRepository: Repository<Session>
	) { }

	async create(createSessionDto: CreateSessionDto): Promise<Session> {
		const id = generateId(createSessionDto.seed);
		if (await this.sessionRepository.findOne(id)) {
			throw new BadRequestException('Session for this user already exist');
		}

		const user = await User.findOne(id);
		if (!user) {
			await User.create({ id, sessionId: id }).save();
		}

		const session = this.sessionRepository.create({
			id,
			addLink: generateId(),
			expirationTimestamp: Math.floor(Date.now() / 1000 + 3600),
		});

		return session.save();
	}

	async findMatching(seed: string): Promise<Session> {
		const id = generateId(seed);
		const user = await User.findOne(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		const session = await this.sessionRepository.findOne(user.sessionId);
		if (!session) {
			throw new NotFoundException('Session not found');
		}

		if (user.sessionId !== user.id) {
			throw new ForbiddenException('Only the creator of the session can access it');
		}

		return session;
	}

	async endMatching(seed: string): Promise<Session> {
		const id = generateId(seed);
		const user = await User.findOne(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (user.id !== user.sessionId) {
			throw new ForbiddenException(
				'Only the creator of the session can modify it'
			);
		}

		const session = await this.sessionRepository.findOne(user.sessionId);
		if (!session) {
			throw new NotFoundException('Session not found');
		}

		const users = await User.find({
			where: {
				sessionId: id,
			},
		});
		await User.remove(users);

		const rooms = await Room.find({
			where: {
				sessionId: id,
			},
			relations: ['lists', 'lists.notes'],
		});

		await Promise.all(rooms.map((room) =>
			Promise.all([
				Promise.all(room.lists.map((list) => Note.remove(list.notes))),
				List.remove(room.lists)
			])
		));
		await Room.remove(rooms);

		return this.sessionRepository.remove(session);
	}

	async aggregateMatching(seed: string): Promise<Session> {
		const id = generateId(seed);
		const user = await User.findOne(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (user.id !== user.sessionId) {
			throw new ForbiddenException(
				'Only the creator of the session can modify it'
			);
		}

		const session = await this.sessionRepository.findOne(user.sessionId);
		// session.phase = SessionPhase.AGGREGATION;

		const rooms = await Room.find({
			where: {
				sessionId: session.id,
			},
			relations: ['lists', 'lists.notes'],
		});

		const lists = rooms.flatMap((room) => room.lists);

		const temp: { [k: string]: Note[] } = {};

		const notesByRoom = lists.reduce((acc, list) => {
			if (acc[list.roomId]) {
				acc[list.roomId].push(...list.notes);
			} else {
				acc[list.roomId] = list.notes;
			}
			return acc;
		}, temp);

		await Promise.all(rooms.map(async (room) => {
			const positiveList = await List.create({
				id: generateId(),
				roomId: generateId(),
				name: 'Positive',
				notes: [],
			}).save();
			const negativeList = await List.create({
				id: generateId(),
				roomId: generateId(),
				name: 'Negative',
				notes: [],
			}).save();
			room.lists.splice(0, room.lists.length, positiveList, negativeList);
			return room.save();
		}));

		return session.save();
	}

	async findByAddLink(addLink: string): Promise<Session> {
		const session = await this.sessionRepository.findOne({
			where: {
				addLink,
			},
		});
		if (!session) {
			throw new NotFoundException('Session not found');
		}

		return session;
	}
}
