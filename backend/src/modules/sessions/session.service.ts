import {
	Injectable,
	BadRequestException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session, SessionPhase } from './entities/session.entity';
import { Repository } from 'typeorm';
import { CreateSessionDto } from './dto/create-session.dto';
import { generateId } from '../../common';
import { User } from '../users/entities/user.entity';
import { Room } from '../rooms/entities/room.entity';
import { List } from '../lists/entities/list.entity';
import { Note } from '../notes/entities/note.entity';
import { SocketGateway } from '../sockets/socket.gateway';
import { SchedulerRegistry } from '@nestjs/schedule';
import { setTimeout } from 'timers';

@Injectable()
export class SessionService {
	constructor(
		@InjectRepository(Session) private sessionRepository: Repository<Session>,
		@InjectRepository(Room) private roomRepository: Repository<Room>,
		private readonly socketGateway: SocketGateway,
		private readonly schedulerRegistry: SchedulerRegistry
	) {}

	private addExpirationTimeout(
		session: Session,
		timeToExpire: number,
		seed: string
	) {
		const sessionExpirationTimeout = setTimeout(() => {
			this.endMatching(null, seed);
		}, timeToExpire * 1000);

		this.schedulerRegistry.addTimeout(
			`sessionExpiration_${session.id}`,
			sessionExpirationTimeout
		);
	}

	async create(
		createSessionDto: CreateSessionDto,
		loggedInUser?: User
	): Promise<Session> {
		const id = generateId(createSessionDto.seed);
		if (await this.sessionRepository.findOne(id)) {
			throw new BadRequestException('Session for this user already exist');
		}

		let user = loggedInUser || (await User.findOne(id));
		if (!user) {
			user = await User.create({ id, sessionId: id }).save();
		}

		const timeToExpire =
			((loggedInUser || {}).premiumSessionsLeft || 0) > 0 ? null : 1800;

		const session = await this.sessionRepository
			.create({
				id,
				creatorId: user.id,
				addLink: generateId(),
				expirationTimestamp: timeToExpire
					? Math.floor(Date.now() / 1000 + timeToExpire)
					: null,
			})
			.save();

		if (timeToExpire) {
			this.addExpirationTimeout(session, timeToExpire, createSessionDto.seed);
		}

		user.sessionId = id;
		user.premiumSessionsLeft = Math.max(0, (user.premiumSessionsLeft || 0) - 1);
		await user.save();

		return session;
	}

	async findMatching(user: User, seed: string): Promise<Session> {
		if (user) {
			const session = await this.sessionRepository.findOne(user.sessionId);
			if (session) {
				return session;
			}
		}

		const id = generateId(seed);
		const session = await this.sessionRepository.findOne(id);
		if (!session) {
			throw new NotFoundException('Session not found');
		}

		if (!(await User.findOne(session.creatorId))) {
			throw new NotFoundException('User not found');
		}

		return session;
	}

	async endMatching(user: User, seed: string): Promise<Session> {
		const id = generateId(seed);

		let session = await this.sessionRepository.findOne(id);
		if (user) {
			const tempSession = await this.sessionRepository.findOne({
				where: {
					creatorId: user.id,
				},
			});

			if (tempSession) {
				session = tempSession;
			}
		} else {
			user = await User.findOne(session.creatorId);
			if (!user) {
				throw new NotFoundException('User not found');
			}
		}

		if (!session) {
			throw new NotFoundException('Session not found');
		}

		if (!user.temporary) {
			user.sessionId = null;
			await user.save();
		}

		const users = await User.find({
			where: {
				sessionId: session.id,
				temporary: true,
			},
		});
		await User.remove(users);

		const rooms = await Room.find({
			where: {
				sessionId: session.id,
			},
			relations: ['lists', 'lists.notes'],
		});

		await Promise.all(
			rooms.map((room) =>
				Promise.all([
					Promise.all(room.lists.map((list) => Note.remove(list.notes))),
					List.remove(room.lists),
				])
			)
		);
		await Room.remove(rooms);

		if (session.expirationTimestamp) {
			this.schedulerRegistry.deleteTimeout(`sessionExpiration_${session.id}`);
		}

		this.socketGateway.sessionEnded(session.id);

		await this.sessionRepository.remove(session);

		return session;
	}

	async aggregateMatching(user: User, seed: string): Promise<Session> {
		const id = generateId(seed);
		let session: Session;
		if (!user) {
			session = await this.sessionRepository.findOne(id);
			if (!session) {
				throw new NotFoundException('Session not found');
			}

			user = await User.findOne(session.creatorId);
			if (!user) {
				throw new NotFoundException('User not found');
			}
		} else {
			session = await this.sessionRepository.findOne({
				where: {
					creatorId: user.id,
				},
			});
		}

		session.phase = SessionPhase.AGGREGATION;

		const rooms = await Room.find({
			where: {
				sessionId: session.id,
			},
			relations: ['lists', 'lists.notes'],
		});

		const lists = rooms.flatMap((room) => room.lists);

		const temp: { [k: string]: Note[] } = {};

		const notesByRoom = lists.reduce((acc, list) => {
			if (acc[list.associatedRoomId]) {
				acc[list.associatedRoomId].push(...list.notes);
			} else {
				acc[list.associatedRoomId] = list.notes;
			}
			return acc;
		}, temp);

		const listsToRemove = [];
		const notesToRemove = [];

		rooms.map((room) => {
			const positiveList = List.create({
				id: generateId(),
				associatedRoomId: generateId(),
				name: 'Positive',
				notes: notesByRoom[room.id]
					.filter((note) => note.positive)
					.map((note) =>
						Note.create({
							...note,
							id: generateId(),
						})
					),
			});
			const negativeList = List.create({
				id: generateId(),
				associatedRoomId: generateId(),
				name: 'Negative',
				notes: notesByRoom[room.id]
					.filter((note) => !note.positive)
					.map((note) =>
						Note.create({
							...note,
							id: generateId(),
						})
					),
			});
			room.ownNotes = true;
			listsToRemove.push(...room.lists);
			notesToRemove.push(...room.lists.flatMap((list) => list.notes));
			room.lists.splice(0, room.lists.length);
			room.lists.push(positiveList);
			room.lists.push(negativeList);
		});

		await Note.remove(notesToRemove);
		await List.remove(listsToRemove);
		await this.roomRepository.save(rooms);

		await session.save();

		this.socketGateway.aggregateNotes(session.id);

		return session;
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
