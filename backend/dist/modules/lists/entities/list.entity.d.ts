import { BaseEntity } from 'typeorm';
import { Note } from '../../notes/entities/note.entity';
import { Room } from '../../rooms/entities/room.entity';
export declare class List extends BaseEntity {
    id: string;
    name: string;
    notes: Note[];
    room: Room;
}
