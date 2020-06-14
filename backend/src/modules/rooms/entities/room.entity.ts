import {
	BaseEntity,
	Entity,
	PrimaryColumn,
	Column,
	OneToMany,
	JoinColumn,
	UpdateDateColumn,
	CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { List } from '../../lists/entities/list.entity';

@Entity({ name: 'Room' })
export class Room extends BaseEntity {
	@PrimaryColumn({ type: 'varchar', length: 16, readonly: true })
	@ApiProperty({
		required: true,
		example: 'l1fcqka1nm3fvw7j',
		description: 'Id of the room',
		readOnly: true,
	})
	id: string;

	@Column({ type: 'varchar', length: 16, readonly: true })
	@ApiProperty({
		required: true,
		example: 'l1fcqka1nm3fvw7j',
		description: 'Id of the associated session',
		readOnly: true,
	})
	sessionId: string;

	@Column({ type: 'varchar', length: 64, readonly: true })
	@ApiProperty({
		required: true,
		example: 'Anonymous',
		description: 'Name of the room',
		readOnly: true,
	})
	name: string;

	@UpdateDateColumn({ readonly: true })
	@ApiProperty({
		required: true,
		example: '1590320753',
		description: 'Time indicating when the last update occured',
		readOnly: true,
	})
	updatedAt: Date;

	@CreateDateColumn({ readonly: true })
	@ApiProperty({
		required: true,
		example: '1590320753',
		description: 'Time indicating when the entity was created',
		readOnly: true,
	})
	createdAt: Date;

	@OneToMany(() => List, (list) => list.room, { cascade: ['insert', 'remove'] })
	@JoinColumn()
	@ApiProperty({
		required: true,
		description: 'Lists associated with this room',
		type: () => [List],
	})
	lists: List[];

	@Column({ type: 'boolean' })
	@ApiProperty({
		required: true,
		example: false,
		description: 'Indicates if the room is ready',
	})
	ready: boolean;

	@Column({ type: 'boolean', default: false })
	@ApiProperty({
		required: false,
		example: false,
		description: 'Indicates if the notes are aggregated',
	})
	ownNotes: boolean = false;
}
