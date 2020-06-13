import { BaseEntity } from 'typeorm';
import { List } from '../../lists/entities/list.entity';
export declare class Room extends BaseEntity {
    id: string;
    sessionId: string;
    name: string;
    lists: List[];
    ready: boolean;
}
