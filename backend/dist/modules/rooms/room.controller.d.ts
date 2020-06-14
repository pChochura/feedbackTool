import { RoomService } from './room.service';
import { Response } from 'express';
import { CreateRoomDto } from './dto/create-room.dto';
import { SetRoomReadyDto } from './dto/set-room-ready.dto';
import { SubmitNoteDto } from './dto/submit-note.dto';
import { RemoveNoteDto } from './dto/remove-note.dto';
export declare class RoomController {
	private readonly roomService;
	constructor(roomService: RoomService);
	create(createRoomDto: CreateRoomDto, response: Response): Promise<void>;
	find(seed: string, response: Response): Promise<void>;
	remove(seed: string, id: string, response: Response): Promise<void>;
	setReady(
		seed: string,
		id: string,
		setRoomReadyDto: SetRoomReadyDto,
		response: Response
	): Promise<void>;
	submitNote(
		seed: string,
		id: string,
		submitNoteDto: SubmitNoteDto,
		response: Response
	): Promise<void>;
	removeNote(
		seed: string,
		id: string,
		removeNoteDto: RemoveNoteDto,
		response: Response
	): Promise<void>;
}
