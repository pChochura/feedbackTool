import {
	Controller,
	Post,
	Res,
	HttpStatus,
	Headers,
	Body,
	HttpException,
	Get,
	Delete,
	UnauthorizedException,
	Patch,
	UseGuards,
	ForbiddenException,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiOkResponse,
	ApiUnauthorizedResponse,
	ApiConflictResponse,
	ApiNotFoundResponse,
	ApiForbiddenResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { BasicResponseSchema } from '../../common/basic-response.schema';
import { sendResponse } from '../../common';
import { Response } from 'express';
import { OneOfResponseSchema } from '../../common/one-of-response.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { CheckEmailDto } from './dto/check-email.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { FinalizeOrderDto } from './dto/finalize-order.dto';
import { CreatedResponseSchema } from '../../common/created-response.schema';
import { AuthSoftGuard } from '../guards/auth-soft.guard';

@ApiTags('Users')
@Controller('api/v1/users')
export class UserController {
	constructor(private readonly userService: UserService) { }

	@Post()
	@ApiOperation({ summary: 'Attempts logging in' })
	@ApiOkResponse({
		description: 'Logged in',
		schema: new BasicResponseSchema('OK'),
	})
	@ApiUnauthorizedResponse({
		description: 'Unathorized',
		schema: new OneOfResponseSchema([
			new BasicResponseSchema('Missing credentials'),
			new BasicResponseSchema('Invalid credentials'),
		]),
	})
	@ApiForbiddenResponse({
		description: 'Email not confirmed',
		schema: new BasicResponseSchema('Email not confirmed'),
	})
	async login(@Headers() headers: any, @Res() response: Response) {
		try {
			const result = await this.userService.login(headers['authorization']);
			response.setHeader('Set-Cookie', `x-session=${result}; Path=/`);
			sendResponse(response, { status: 'OK' }, HttpStatus.OK);
		} catch (error) {
			if (!(error instanceof HttpException)) {
				response.set('WWW-Authenticate', error.message);
				throw new UnauthorizedException('Invalid credentials');
			}

			throw error;
		}
	}

	@Post('/create')
	@ApiOperation({ summary: 'Creates a new user' })
	@ApiOkResponse({
		description: 'Created a new user',
		type: User,
	})
	@ApiConflictResponse({
		description: 'Such user already exist',
		schema: new BasicResponseSchema('Such user already exist'),
	})
	async create(
		@Body() createUserDto: CreateUserDto,
		@Res() response: Response
	) {
		const user = await this.userService.create(createUserDto);
		sendResponse(response, user, HttpStatus.CREATED);
	}

	@Post('/email')
	@ApiOperation({
		summary: 'Checks if the given email is valid and has no conflicts',
	})
	@ApiOkResponse({
		description: 'Email is valid and has no conflicts',
		schema: new BasicResponseSchema('OK'),
	})
	@ApiConflictResponse({
		description: 'Such user already exist',
		schema: new BasicResponseSchema('Such user already exist'),
	})
	async checkEmail(
		@Body() checkEmailDto: CheckEmailDto,
		@Res() response: Response
	) {
		await this.userService.checkEmail(checkEmailDto);
		sendResponse(response, { status: 'OK' }, HttpStatus.OK);
	}

	@Patch('/email')
	@ApiOperation({
		summary: 'Resends email confirmation',
	})
	@ApiOkResponse({
		description: 'Resent email confirmation',
		schema: new BasicResponseSchema('OK'),
	})
	@ApiNotFoundResponse({
		description: 'User not found',
		schema: new BasicResponseSchema('User not found'),
	})
	async sendConfirmationEmail(@Headers() headers: any, @Body() body: { token?: string; }, @Res() response: Response) {
		await this.userService.sendConfirmationEmail(headers['authorization'], body.token);
		sendResponse(response, { status: 'OK' }, HttpStatus.OK);
	}

	@Post('/email/confirm')
	@ApiOperation({
		summary: 'Confirms email address',
	})
	@ApiOkResponse({
		description: 'Confirmed email address',
		schema: new BasicResponseSchema('OK'),
	})
	@ApiNotFoundResponse({
		description: 'User not found',
		schema: new BasicResponseSchema('User not found'),
	})
	@ApiForbiddenResponse({
		description: 'Email is already confirmed',
		schema: new BasicResponseSchema('Email is already confirmed'),
	})
	async cnfirmEmail(@Body() body: { token: string; }, @Res() response: Response) {
		await this.userService.confirmEmail(body.token);
		sendResponse(response, { status: 'OK' }, HttpStatus.OK);
	}

	@Get()
	@UseGuards(AuthSoftGuard)
	@ApiOperation({ summary: 'Returns a user based on the session token' })
	@ApiOkResponse({
		description: 'Returned a user based on the session token',
		type: User,
	})
	@ApiForbiddenResponse({
		description: 'Missing credentials',
		schema: new BasicResponseSchema('Missing credentials'),
	})
	async findByToken(@Res() response: Response) {
		// @ts-ignore
		if (!response.user) {
			throw new ForbiddenException('Missing credentials');
		}

		// @ts-ignore
		const { secret, sessionToken, ...user } = response.user;
		sendResponse(response, user, HttpStatus.OK);
	}

	@Delete()
	@UseGuards(AuthSoftGuard)
	@ApiOperation({ summary: 'Removes the given account' })
	@ApiOkResponse({
		description: 'Removed the given account',
		schema: new BasicResponseSchema('OK'),
	})
	@ApiForbiddenResponse({
		description: 'Missing credentials',
		schema: new BasicResponseSchema('Missing credentials'),
	})
	async delete(@Res() response: Response) {
		// @ts-ignore
		await this.userService.delete(response.user);
		sendResponse(response, { status: 'OK' }, HttpStatus.OK);
	}

	@Post('/order')
	@UseGuards(AuthSoftGuard)
	@ApiOperation({ summary: 'Creates a order for premium sessions bundle' })
	@ApiOkResponse({
		description: 'Created a order for premium sessions bundle',
		schema: new CreatedResponseSchema('link', 'string', 'http://localhost/1234', 'Link of the paypal transaction'),
	})
	async createOrder(
		@Body() createOrderDto: CreateOrderDto,
		@Res() response: Response
	) {
		// @ts-ignore
		const link = await this.userService.createOrder(response.user, createOrderDto);
		sendResponse(response, { link }, HttpStatus.OK);
	}

	@Patch('/order')
	@ApiOperation({ summary: 'Finalizes created transaction' })
	@ApiOkResponse({
		description: 'Finalized created transaction',
		schema: new BasicResponseSchema('OK'),
	})
	@ApiNotFoundResponse({
		description: 'Item not found',
		schema: new OneOfResponseSchema([
			new BasicResponseSchema('Transaction not found'),
			new BasicResponseSchema('User not found'),
		]),
	})
	@ApiForbiddenResponse({
		description: 'Transaction is already finalized',
		schema: new BasicResponseSchema('Transaction is already finalized'),
	})
	async finalizeOrder(
		@Body() finalizeOrderDto: FinalizeOrderDto,
		@Res() response: Response
	) {
		await this.userService.finalizeOrder(finalizeOrderDto);
		sendResponse(response, { status: 'OK' }, HttpStatus.OK);
	}
}
