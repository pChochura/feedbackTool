import { BaseEntity } from 'typeorm';
import { List } from '../../lists/entities/list.entity';
export declare class Note extends BaseEntity {
	id: string;
	content: string;
	positive: boolean;
	list: List;
}
