import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { SetRoomReadyDto } from './dto/set-room-ready.dto';
import { SubmitNoteDto } from './dto/submit-note.dto';
import { RemoveNoteDto } from './dto/remove-note.dto';
export declare class RoomService {
    private roomRepository;
    constructor(roomRepository: Repository<Room>);
    create(createRoomDto: CreateRoomDto): Promise<Room>;
    findMatching(seed: string): Promise<Room[]>;
    remove(seed: string, roomId: string): Promise<Room>;
    setReady(seed: string, roomId: string, setRoomReadyDto: SetRoomReadyDto): Promise<Room>;
    sumbitNote(seed: string, roomId: string, submitNoteDto: SubmitNoteDto): Promise<Room>;
    removeNote(seed: string, roomId: string, removeNoteDto: RemoveNoteDto): Promise<Room>;
}
