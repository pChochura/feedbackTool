import {
	BaseEntity,
	Entity,
	PrimaryColumn,
	Column,
	ManyToOne,
	UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { List } from '../../lists/entities/list.entity';

@Entity({ name: 'Note' })
export class Note extends BaseEntity {
	@PrimaryColumn({ type: 'varchar', length: 16, readonly: true })
	@ApiProperty({
		required: true,
		example: 'l1fcqka1nm3fvw7j',
		description: 'Id of the note',
		readOnly: true,
	})
	id: string;

	@Column({ type: 'varchar', length: 512 })
	@ApiProperty({
		required: true,
		example: 'Content of the note',
		description: 'Content of the note',
	})
	content: string;

	@Column({ type: 'boolean' })
	@ApiProperty({
		required: true,
		example: true,
		description: 'Indicates if the rating is positive or negative',
	})
	positive: boolean;

	@UpdateDateColumn({ readonly: true })
	@ApiProperty({
		required: true,
		example: '1590320753',
		description: 'Time indicating when the last update occured',
		readOnly: true,
	})
	updatedAt: Date;

	@ManyToOne(() => List, (list) => list.notes, { onDelete: 'CASCADE' })
	@ApiProperty({
		required: true,
		description: 'Associated list',
		type: () => List,
	})
	list: List;
}
