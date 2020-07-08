import {
	Injectable,
	UnauthorizedException,
	ConflictException,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, In } from 'typeorm';
import { QOP_AUTH, ServerDigestAuth } from '@mreal/digest-auth';
import { CreateUserDto } from './dto/create-user.dto';
import { generateId, generateToken } from '../../common';
import { CheckEmailDto } from './dto/check-email.dto';
import { ClientDigest } from '@mreal/digest-auth/build/main/server';
import { Session } from '../sessions/entities/session.entity';
import { Room } from '../rooms/entities/room.entity';
import { Note } from '../notes/entities/note.entity';
import { List } from '../lists/entities/list.entity';
import { SocketGateway } from '../sockets/socket.gateway';
import { EmailService } from '../emails/email.service';
import { PaypalService } from '../paypal/paypal.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { FinalizeOrderDto } from './dto/finalize-order.dto';
import { Transaction } from '../transactions/entities/transaction.entity';
import { LoggerService } from '../logger/logger.service';
import { EXPORT_TYPE } from './user.controller';
import { createCanvas } from 'canvas';
import * as fs from 'fs';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly userRespository: Repository<User>,
		private readonly emailService: EmailService,
		private readonly socketGateway: SocketGateway,
		private readonly paypalService: PaypalService,
		private readonly loggerService: LoggerService
	) {
		this.loggerService.setContext('user.service');
	}

	async getUserByAuthHeader(authHeader: string): Promise<User> {
		const incomingDigest = ServerDigestAuth.analyze(authHeader, [QOP_AUTH]);
		return this.userRespository.findOne({ email: incomingDigest.username });
	}

	async verifyBySecret(
		incomingDigest: ClientDigest,
		user?: User
	): Promise<boolean> {
		return ServerDigestAuth.verifyBySecret(incomingDigest, user.secret, {
			method: 'POST',
			uri: '/api/v1/users',
			entryBody: '',
		});
	}

	async login(auth?: string): Promise<String> {
		if (!auth) {
			throw new Error(ServerDigestAuth.generateResponse('all').raw);
		}

		const incomingDigest = ServerDigestAuth.analyze(auth, [QOP_AUTH]);
		const user = await this.userRespository.findOne({
			email: incomingDigest.username,
		});

		if (!user || !(await this.verifyBySecret(incomingDigest, user))) {
			throw new UnauthorizedException('Invalid credentials');
		}

		if (!user.confirmed) {
			throw new ForbiddenException('Email not confirmed');
		}

		const sessionToken = generateToken();
		user.sessionToken = sessionToken;
		await user.save();

		this.loggerService.info('User logged in', {
			email: incomingDigest.username,
		});

		return sessionToken;
	}

	async create(createUserDto: CreateUserDto): Promise<User> {
		if (await this.userRespository.findOne({ email: createUserDto.email })) {
			throw new ConflictException('Such user already exist');
		}

		const user = await this.userRespository
			.create({
				...createUserDto,
				temporary: false,
				id: generateId(),
				sessionToken: generateToken(),
			})
			.save();

		this.loggerService.info('User created', { email: createUserDto.email });

		await this.emailService.sendEmailConfirmation(
			createUserDto.email,
			user.sessionToken
		);

		return user;
	}

	async checkEmail(checkEmailDto: CheckEmailDto) {
		this.loggerService.info('Checking email for duplicate', {
			email: checkEmailDto.email,
		});
		if (await this.userRespository.findOne({ email: checkEmailDto.email })) {
			throw new ConflictException('Such user already exist');
		}
	}

	async sendConfirmationEmail(auth: string, token: string) {
		if (auth) {
			const digest = ServerDigestAuth.analyze(auth, [QOP_AUTH]);
			const user = await this.userRespository.findOne({
				email: digest.username,
			});

			this.loggerService.info('Sending confirmation email - auth', {
				email: digest.username,
			});

			if (!user || !(await this.verifyBySecret(digest, user))) {
				throw new UnauthorizedException('Invalid credentials');
			}

			await this.emailService.sendEmailConfirmation(
				user.email,
				user.sessionToken
			);

			return;
		}

		const user = await this.userRespository.findOne({ sessionToken: token });
		if (!user) {
			throw new NotFoundException('User not found');
		}

		await this.emailService.sendEmailConfirmation(
			user.email,
			user.sessionToken
		);
	}

	async confirmEmail(token: string) {
		const user = await this.userRespository.findOne({ sessionToken: token });
		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (user.confirmed) {
			throw new ForbiddenException('Email is already confirmed');
		}

		user.confirmed = true;
		await user.save();

		this.loggerService.info('Email confirmed', { email: user.email });
	}

	async findByToken(token: string): Promise<User> {
		if (!token) {
			throw new ForbiddenException('Missing credentials');
		}

		const user = await this.userRespository.findOne({ sessionToken: token });
		if (!user) {
			throw new NotFoundException('User not found');
		}

		this.loggerService.info('User found by token', { email: user.email });

		return user;
	}

	async delete(user: User) {
		const sessions = await Session.find({
			where: [{ id: user.id }, { creatorId: user.id }],
		});
		if (sessions.length > 0) {
			const rooms = await Room.find({
				where: {
					sessionId: In(sessions.map((s) => s.id)),
				},
			});
			const listsToRemove = rooms.flatMap((_room) => _room.lists);

			await Note.remove(listsToRemove.flatMap((list) => list.notes));
			this.loggerService.info('Notes removed', {
				notesIds: listsToRemove.flatMap((list) =>
					list.notes.map((note) => note.id)
				),
			});

			await List.remove(listsToRemove);
			this.loggerService.info('Lists removed', {
				listsIds: listsToRemove.map((list) => list.id),
			});

			await Room.remove(rooms);
			this.loggerService.info('Rooms removed', {
				roomsIds: rooms.map((room) => room.id),
			});

			await Session.remove(sessions);
			this.loggerService.info('Sessions removed', {
				sessionsId: sessions.map((session) => session.id),
			});

			rooms.forEach((room) =>
				this.socketGateway.roomRemoved(room.sessionId, room.id)
			);
			sessions.forEach((session) =>
				this.socketGateway.sessionEnded(session.id)
			);
		}

		await user.remove();
		this.loggerService.info('User removed', { email: user.email });
	}

	async createOrder(
		user: User,
		createOrderDto: CreateOrderDto
	): Promise<string> {
		if (!user && !createOrderDto.token) {
			throw new UnauthorizedException('Missing credentials');
		}
		const loggedIn = !!user;
		user =
			user ||
			(await this.userRespository.findOne({
				sessionToken: createOrderDto.token,
			}));

		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (!user.confirmed) {
			throw new ForbiddenException('Email not confirmed');
		}

		this.loggerService.info('Create order', {
			loggedIn,
			email: user.email,
			amount: createOrderDto.amount,
		});

		const link = await this.paypalService.createOrder(user, createOrderDto);

		return link;
	}

	async finalizeOrder(finalizeOrderDto: FinalizeOrderDto) {
		const transaction = await Transaction.findOne(finalizeOrderDto.token);
		if (!transaction) {
			throw new NotFoundException('Transaction not found');
		}

		if (transaction.finalized) {
			throw new ForbiddenException('Transaction is already finalized');
		}

		const user = await User.findOne(transaction.userId);
		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (finalizeOrderDto.cancel === false) {
			user.premiumSessionsLeft =
				(user.premiumSessionsLeft || 0) + transaction.amount;
			await user.save();
		}

		transaction.finalized = true;
		await transaction.save();

		this.emailService.sendPayment(
			user.email,
			transaction.unitPrice,
			transaction.amount / transaction.bundleCount,
			transaction.discount,
			transaction.price
		);

		this.loggerService.info('Transaction finalized', {
			userId: user.id,
			canceled: finalizeOrderDto.cancel,
			amount: transaction.amount,
		});
	}

	async exportNotes(user: User, seed: string, type: EXPORT_TYPE) {
		const id = generateId(seed);
		const room = await Room.findOne({
			where: [{ id: user.sessionId }, { id }],
		});
		if (!room) {
			throw new NotFoundException('Room not found');
		}

		const lists = await List.find({
			where: { associatedRoomId: room.id },
			relations: ['notes'],
		});

		const COLUMN_WIDTH = 300;
		const LISTS_PADDING = 50;
		const NOTES_PADDING = 20;
		const NOTES_MARGIN = 10;
		const NOTES_WIDTH = COLUMN_WIDTH - 2 * (NOTES_PADDING + NOTES_MARGIN);
		const LINE_HEIGHT = 20;

		const tempContext = createCanvas(COLUMN_WIDTH, 1000).getContext('2d');

		const width = lists.length * COLUMN_WIDTH + 2 * LISTS_PADDING;
		const height = lists.reduce((finalHeight, list) => {
			const textHeight = list.notes.reduce((height, note) => {
				let currentLine = '';
				const linesCount = note.content.split(' ').reduce((count, word) => {
					currentLine += word + ' ';
					if (tempContext.measureText(currentLine).width > NOTES_WIDTH) {
						currentLine = word;
						count++;
					}

					return count;
				}, 0);

				return Math.max(linesCount * LINE_HEIGHT + NOTES_PADDING, height);
			}, 0);
			const height = list.notes.length * (NOTES_PADDING * 2 + textHeight);
			return Math.max(height, finalHeight);
		}, 0);

		// @todo: finish exporting notes
	}

	async checkExport(user: User, seed: string) {
		const id = generateId(seed);
		user = user || (await User.findOne(id));
		if (!user) {
			throw new ForbiddenException(
				'Only premium session members can export notes'
			);
		}

		const session = await Session.findOne(user.sessionId);
		if (!session || session.expirationTimestamp) {
			throw new ForbiddenException(
				'Only premium session members can export notes'
			);
		}
	}
}
