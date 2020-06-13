import {
	BaseEntity,
	Entity,
	PrimaryColumn,
	Column,
	ManyToOne,
	OneToMany,
	JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Note } from '../../notes/entities/note.entity';
import { Room } from '../../rooms/entities/room.entity';

@Entity({ name: 'List' })
export class List extends BaseEntity {
	@PrimaryColumn({ type: 'varchar', length: 16, readonly: true })
	@ApiProperty({
		required: true,
		example: 'l1fcqka1nm3fvw7j',
		description: "Id of the list",
		readOnly: true,
	})
	id: string;

	@Column({ type: 'varchar', length: 16, readonly: true })
	@ApiProperty({
		required: true,
		example: 'l1fcqka1nm3fvw7j',
		description: "Id of the room",
		readOnly: true,
	})
	roomId: string;

	@Column({ type: 'varchar', length: 64, readonly: true })
	@ApiProperty({
		required: true,
		example: 'Anonymous',
		description: "Name of the room's list",
		readOnly: true,
	})
	name: string;

	@OneToMany(() => Note, note => note.list, { cascade: true })
	@JoinColumn()
	@ApiProperty({
		required: true,
		description: "Lists' notes",
		type: () => [Note],
	})
	notes: Note[];

	@ManyToOne(() => Room, room => room.lists, { onDelete: 'CASCADE' })
	@ApiProperty({
		required: true,
		description: 'Associated room',
		type: () => Room,
	})
	room: Room;
}
