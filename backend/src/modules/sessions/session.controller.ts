import {
	Controller,
	Res,
	HttpStatus,
	Post,
	Body,
	Get,
	Patch,
	UseGuards,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiOkResponse,
	ApiBadRequestResponse,
	ApiNotFoundResponse,
} from '@nestjs/swagger';
import { SessionService } from './session.service';
import { sendResponse } from '../../common';
import { Response } from 'express';
import { CreateSessionDto } from './dto/create-session.dto';
import { CreatedResponseSchema } from '../../common/created-response.schema';
import { BasicResponseSchema } from '../../common/basic-response.schema';
import { Cookies } from '@nestjsplus/cookies';
import { Session } from './entities/session.entity';
import { OneOfResponseSchema } from '../../common/one-of-response.schema';
import { AuthSoftGuard } from '../guards/auth-soft.guard';

@ApiTags('Sessions')
@Controller('api/v1/sessions')
export class SessionController {
	constructor(private readonly sessionService: SessionService) { }

	@Post()
	@UseGuards(AuthSoftGuard)
	@ApiOperation({ summary: 'Creates a new session' })
	@ApiOkResponse({
		description: 'Created a new session',
		schema: new CreatedResponseSchema(
			'id',
			'string',
			'dasjhhjie34noi8f',
			'Id of the created session'
		),
	})
	@ApiBadRequestResponse({
		description: 'Bad request',
		schema: new BasicResponseSchema('Session for this user already exist'),
	})
	async create(
		@Body() createSessionDto: CreateSessionDto,
		@Res() response: Response
	) {
		const session = await this.sessionService.create(
			createSessionDto,
			// @ts-ignore
			response.user
		);
		sendResponse(response, { id: session.id }, HttpStatus.CREATED);
	}

	@Get()
	@UseGuards(AuthSoftGuard)
	@ApiOperation({ summary: 'Returns session matched by a seed in a cookie' })
	@ApiOkResponse({
		description: 'Returned session matched by a seed in a cookie',
		type: Session,
	})
	@ApiNotFoundResponse({
		description: 'Item not found',
		schema: new OneOfResponseSchema([
			new BasicResponseSchema('User not found'),
			new BasicResponseSchema('Session not found'),
		]),
	})
	async find(@Cookies('seed') seed: string, @Res() response: Response) {
		// @ts-ignore
		const session = await this.sessionService.findMatching(response.user, seed);
		sendResponse(response, session);
	}

	@Post('/end')
	@UseGuards(AuthSoftGuard)
	@ApiOperation({
		summary: 'Ends a session and removes associated users froms the database',
	})
	@ApiOkResponse({
		description:
			'Ended a session and removed associated users froms the database',
		schema: new BasicResponseSchema('OK'),
	})
	@ApiNotFoundResponse({
		description: 'Item not found',
		schema: new OneOfResponseSchema([
			new BasicResponseSchema('User not found'),
			new BasicResponseSchema('Session not found'),
		]),
	})
	async end(@Cookies('seed') seed: string, @Res() response: Response) {
		// @ts-ignore
		await this.sessionService.endMatching(response.user, seed);
		sendResponse(response, { status: 'OK' });
	}

	@Patch('/aggregate')
	@UseGuards(AuthSoftGuard)
	@ApiOperation({
		summary:
			'Aggregates all notes from the room associated with a given session',
	})
	@ApiOkResponse({
		description:
			'Aggregated all notes from the room associated with a given session',
		schema: new BasicResponseSchema('OK'),
	})
	@ApiNotFoundResponse({
		description: 'User not found',
		schema: new BasicResponseSchema('User not found'),
	})
	async aggregate(@Cookies('seed') seed: string, @Res() response: Response) {
		// @ts-ignore
		await this.sessionService.aggregateMatching(response.user, seed);
		sendResponse(response, { status: 'OK' });
	}

	@Post('/checkAdd')
	@ApiOperation({
		summary: 'Checks if the given link coressponds to an existing session',
	})
	@ApiOkResponse({
		description: 'Checked if the given link coressponds to an existing session',
		schema: new BasicResponseSchema('OK'),
	})
	@ApiNotFoundResponse({
		description: 'Session not found',
		schema: new BasicResponseSchema('Session not found'),
	})
	async matchAddPage(
		@Body() body: { addLink: string; },
		@Res() response: Response
	) {
		await this.sessionService.findByAddLink(body.addLink);
		sendResponse(response, { status: 'OK' });
	}
}
