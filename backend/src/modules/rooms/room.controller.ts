import {
	Controller,
	Res,
	HttpStatus,
	Post,
	Body,
	Get,
	Patch,
	Delete,
	Param,
	UseGuards,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiOkResponse,
	ApiConflictResponse,
	ApiNotFoundResponse,
	ApiBadRequestResponse,
	ApiForbiddenResponse,
} from '@nestjs/swagger';
import { RoomService } from './room.service';
import { Room } from './entities/room.entity';
import { BasicResponseSchema } from '../../common/basic-response.schema';
import { sendResponse } from '../../common';
import { Response } from 'express';
import { Cookies } from '@nestjsplus/cookies';
import { CreateRoomDto } from './dto/create-room.dto';
import { OneOfResponseSchema } from '../../common/one-of-response.schema';
import { SetRoomReadyDto } from './dto/set-room-ready.dto';
import { SubmitNoteDto } from './dto/submit-note.dto';
import { RemoveNoteDto } from './dto/remove-note.dto';
import { CustomResponseSchema } from '../../common/custom-response.schema';
import { AuthSoftGuard } from '../guards/auth-soft.guard';
import { AuthResponse } from '../../common/response';

@ApiTags('Rooms')
@Controller('api/v1/rooms')
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	@Post()
	@ApiOperation({ summary: 'Creates a room' })
	@ApiOkResponse({
		description: 'Created a room',
		type: Room,
	})
	@ApiConflictResponse({
		description: 'Room for this user already exist',
		schema: new BasicResponseSchema('Room for this user already exist'),
	})
	@ApiNotFoundResponse({
		description: 'Session not found',
		schema: new BasicResponseSchema('Session not found'),
	})
	@ApiBadRequestResponse({
		description: 'This action is now locked',
		schema: new BasicResponseSchema('This action is now locked'),
	})
	async create(
		@Body() createRoomDto: CreateRoomDto,
		@Res() response: Response
	) {
		const room = await this.roomService.create(createRoomDto);
		sendResponse(response, room, HttpStatus.CREATED);
	}

	@Get()
	@UseGuards(AuthSoftGuard)
	@ApiOperation({ summary: 'Returns matching rooms' })
	@ApiOkResponse({
		description: 'Returned matching rooms',
		schema: new CustomResponseSchema([
			{
				id: 'l1fcqka1nm3fvw7j',
				sessionId: 'l1fcqka1nm3fvw7j',
				name: 'Anonymous',
				lists: [
					{
						id: 'l1fcqka1nm3fvw7j',
						name: 'Anonymous',
						count: 1,
					},
				],
			},
		]),
	})
	@ApiNotFoundResponse({
		description: 'Item not found',
		schema: new OneOfResponseSchema([
			new BasicResponseSchema('User not found'),
			new BasicResponseSchema('Session not found'),
		]),
	})
	async findAllMatching(
		@Cookies('seed') seed: string,
		@Res() response: AuthResponse
	) {
		const rooms = await this.roomService.findAllMatching(response.user, seed);
		sendResponse(
			response,
			rooms.map((room) => ({
				id: room.id,
				name: room.name,
				lists: room.lists.map((list) => ({
					id: list.id,
					name: list.name,
					count: list.notes.length,
				})),
				ready: room.ready,
				own: room.own,
			}))
		);
	}

	@Get('/find')
	@UseGuards(AuthSoftGuard)
	@ApiOperation({ summary: 'Returns a matching room' })
	@ApiOkResponse({
		description: 'Returned a matching room',
		type: Room,
	})
	@ApiNotFoundResponse({
		description: 'Item not found',
		schema: new OneOfResponseSchema([
			new BasicResponseSchema('Session not found'),
			new BasicResponseSchema('Room not found'),
		]),
	})
	async findOneMatching(
		@Cookies('seed') seed: string,
		@Res() response: AuthResponse
	) {
		const room = await this.roomService.findOneMatching(response.user, seed);
		sendResponse(response, room);
	}

	@Get('/:id')
	@UseGuards(AuthSoftGuard)
	@ApiOperation({ summary: 'Returns a room by the given id' })
	@ApiOkResponse({
		description: 'Returned a room by the given id',
		type: Room,
	})
	@ApiNotFoundResponse({
		description: 'Item not found',
		schema: new OneOfResponseSchema([
			new BasicResponseSchema('User not found'),
			new BasicResponseSchema('Room not found'),
		]),
	})
	async findOne(
		@Cookies('seed') seed: string,
		@Param('id') id: string,
		@Res() response: AuthResponse
	) {
		const room = await this.roomService.findOne(response.user, seed, id);
		sendResponse(response, room);
	}

	@Delete('/:id')
	@UseGuards(AuthSoftGuard)
	@ApiOperation({ summary: 'Removes the given room' })
	@ApiOkResponse({
		description: 'Removed the given room',
		schema: new BasicResponseSchema('OK'),
	})
	@ApiNotFoundResponse({
		description: 'Item not found',
		schema: new OneOfResponseSchema([
			new BasicResponseSchema('User not found'),
			new BasicResponseSchema('Room not found'),
			new BasicResponseSchema('Session not found'),
		]),
	})
	@ApiBadRequestResponse({
		description: 'This action is now locked',
		schema: new BasicResponseSchema('This action is now locked'),
	})
	async remove(
		@Cookies('seed') seed: string,
		@Param('id') id: string,
		@Res() response: AuthResponse
	) {
		await this.roomService.remove(response.user, seed, id);
		sendResponse(response, { status: 'OK' });
	}

	@Patch('/:id/ready')
	@UseGuards(AuthSoftGuard)
	@ApiOperation({
		summary: 'Marks the given room as ready or not (depending on the input)',
	})
	@ApiOkResponse({
		description:
			'Marked the given room as ready or not (depending on the input)',
		schema: new BasicResponseSchema('OK'),
	})
	@ApiNotFoundResponse({
		description: 'Item not found',
		schema: new OneOfResponseSchema([
			new BasicResponseSchema('User not found'),
			new BasicResponseSchema('Room not found'),
		]),
	})
	@ApiBadRequestResponse({
		description: 'This action is now locked',
		schema: new BasicResponseSchema('This action is now locked'),
	})
	async setReady(
		@Cookies('seed') seed: string,
		@Param('id') id: string,
		@Body() setRoomReadyDto: SetRoomReadyDto,
		@Res() response: AuthResponse
	) {
		await this.roomService.setReady(response.user, seed, id, setRoomReadyDto);
		sendResponse(response, { status: 'OK' });
	}

	@Patch('/:id/note')
	@ApiOperation({
		summary: 'Adds a new note to the room or edits existing note',
	})
	@ApiOkResponse({
		description: 'Added a new note to the room or edited existing note',
		schema: new BasicResponseSchema('OK'),
	})
	@ApiNotFoundResponse({
		description: 'Item not found',
		schema: new OneOfResponseSchema([
			new BasicResponseSchema('User not found'),
			new BasicResponseSchema('Room not found'),
			new BasicResponseSchema('List not found'),
		]),
	})
	@ApiForbiddenResponse({
		description: 'Authorization error',
		schema: new BasicResponseSchema('Only the creator of room can modify it'),
	})
	@ApiBadRequestResponse({
		description: 'This action is now locked',
		schema: new BasicResponseSchema('This action is now locked'),
	})
	async submitNote(
		@Cookies('seed') seed: string,
		@Param('id') id: string,
		@Body() submitNoteDto: SubmitNoteDto,
		@Res() response: Response
	) {
		await this.roomService.sumbitNote(seed, id, submitNoteDto);
		sendResponse(response, { status: 'OK' });
	}

	@Delete('/:id/note')
	@ApiOperation({ summary: 'Removes note from the room' })
	@ApiOkResponse({
		description: 'Removed note from the room',
		schema: new BasicResponseSchema('OK'),
	})
	@ApiNotFoundResponse({
		description: 'Item not found',
		schema: new OneOfResponseSchema([
			new BasicResponseSchema('User not found'),
			new BasicResponseSchema('Room not found'),
			new BasicResponseSchema('List not found'),
			new BasicResponseSchema('Note not found'),
		]),
	})
	@ApiForbiddenResponse({
		description: 'Authorization error',
		schema: new BasicResponseSchema('Only the creator of room can modify it'),
	})
	@ApiBadRequestResponse({
		description: 'This action is now locked',
		schema: new BasicResponseSchema('This action is now locked'),
	})
	async removeNote(
		@Cookies('seed') seed: string,
		@Param('id') id: string,
		@Body() removeNoteDto: RemoveNoteDto,
		@Res() response: Response
	) {
		await this.roomService.removeNote(seed, id, removeNoteDto);
		sendResponse(response, { status: 'OK' });
	}
}
