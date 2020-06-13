import {
	Controller,
	Res,
	HttpStatus,
	Post,
	Body,
	Get,
	Patch,
	Param,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiOkResponse,
	ApiBadRequestResponse,
	ApiNotFoundResponse,
	ApiForbiddenResponse,
} from '@nestjs/swagger';
import { SessionService } from './session.service';
import { sendResponse, sendError } from '../../common';
import { Response, response } from 'express';
import { CreateSessionDto } from './dto/create-session.dto';
import { CreatedResponseSchema } from '../../common/created-response.schema';
import { BasicResponseSchema } from '../../common/basic-response.schema';
import { Cookies } from '@nestjsplus/cookies';
import { Session } from './entities/session.entity';
import { OneOfResponseSchema } from '../../common/one-of-response.schema';

@ApiTags('Sessions')
@Controller('api/v1/sessions')
export class SessionController {
	constructor(private readonly sessionService: SessionService) {}

	@Post()
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
		try {
			const session = await this.sessionService.create(createSessionDto);
			sendResponse(response, { id: session.id }, HttpStatus.CREATED);
		} catch (error) {
			sendError(response, error);
		}
	}

	@Get()
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
	@ApiForbiddenResponse({
		description: 'Authorization error',
		schema: new BasicResponseSchema('Only the creator of the session can access it'),
	})
	async find(@Cookies('seed') seed: string, @Res() response: Response) {
		try {
			const session = await this.sessionService.findMatching(seed);
			sendResponse(response, session);
		} catch (error) {
			sendError(response, error);
		}
	}

	@Post('/end')
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
	@ApiForbiddenResponse({
		description: 'Authorization error',
		schema: new BasicResponseSchema(
			'Only the creator of the session can modify it'
		),
	})
	async end(@Cookies('seed') seed: string, @Res() response: Response) {
		try {
			await this.sessionService.endMatching(seed);
			sendResponse(response, { status: 'OK' });
		} catch (error) {
			sendError(response, error);
		}
	}

	@Patch('/aggregate')
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
	@ApiForbiddenResponse({
		description: 'Authorization error',
		schema: new BasicResponseSchema(
			'Only the creator of the session can modify it'
		),
	})
	async aggregate(@Cookies('seed') seed: string, @Res() response: Response) {
		try {
			await this.sessionService.aggregateMatching(seed);
			sendResponse(response, { status: 'OK' });
		} catch (error) {
			sendError(response, error);
		}
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
	async matchAddPage(@Body() body: { addLink: string }, @Res() response: Response) {
		try {
			await this.sessionService.findByAddLink(body.addLink);
			sendResponse(response, { status: 'OK' });
		} catch (error) {
			sendError(response, error);
		}
	}
}
