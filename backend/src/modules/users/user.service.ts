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

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly userRespository: Repository<User>,
		private readonly emailService: EmailService,
		private readonly socketGateway: SocketGateway,
		private readonly paypalService: PaypalService,
		private readonly loggerService: LoggerService
	) { }

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

		await this.emailService.sendEmailConfirmation(
			createUserDto.email,
			user.sessionToken
		);

		return user;
	}

	async checkEmail(checkEmailDto: CheckEmailDto) {
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
	}

	async findByToken(token: string): Promise<User> {
		if (!token) {
			throw new ForbiddenException('Missing credentials');
		}

		const user = await this.userRespository.findOne({ sessionToken: token });
		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}

	async delete(user: User) {
		const sessions = await Session.find({
			where: {
				id: user.id,
			},
		});
		if (sessions.length > 0) {
			const rooms = await Room.find({
				where: {
					sessionId: In(sessions.map((s) => s.id)),
				},
			});
			const listsToRemove = rooms.flatMap((_room) => _room.lists);

			await Note.remove(listsToRemove.flatMap((list) => list.notes));
			await List.remove(listsToRemove);
			await Room.remove(rooms);
			await Session.remove(sessions);

			rooms.forEach((room) =>
				this.socketGateway.roomRemoved(room.sessionId, room.id)
			);
			sessions.forEach((session) =>
				this.socketGateway.sessionEnded(session.id)
			);
		}

		await user.remove();
	}

	async createOrder(
		user: User,
		createOrderDto: CreateOrderDto
	): Promise<string> {
		if (!user && !createOrderDto.token) {
			throw new UnauthorizedException('Missing credentials');
		}
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
	}
}
