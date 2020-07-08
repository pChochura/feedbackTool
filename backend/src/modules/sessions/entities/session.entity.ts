import {
	Entity,
	BaseEntity,
	PrimaryColumn,
	Column,
	UpdateDateColumn,
	CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum SessionPhase {
	CREATION = 0,
	AGGREGATION = 1,
}

@Entity({ name: 'Session' })
export class Session extends BaseEntity {
	@PrimaryColumn({ type: 'varchar', length: 16, readonly: true })
	@ApiProperty({
		required: true,
		example: 'l1fcqka1nm3fvw7j',
		description: 'Id of the session',
		readOnly: true,
	})
	id: string;

	@Column({ type: 'varchar', length: 16, readonly: true })
	@ApiProperty({
		required: true,
		example: 'l1fcqka1nm3fvw7j',
		description: 'Id of the user who created the session',
		readOnly: true,
	})
	creatorId: string;

	@Column({ length: 16, readonly: true })
	@ApiProperty({
		required: true,
		example: 'l1fcqka1nm3fvw7j',
		description: 'Id of the add room page',
		readOnly: true,
	})
	addLink: string;

	@Column({ type: 'integer', readonly: true, nullable: true })
	@ApiProperty({
		required: true,
		example: '1590320753',
		description: 'Timestamp indicating expiration time',
		nullable: true,
		readOnly: true,
	})
	expirationTimestamp?: number;

	@Column({ type: 'smallint', default: 0 })
	@ApiProperty({
		required: true,
		example: 0,
		description: 'Current phase of the session (creation / aggregation)',
		default: 0,
	})
	phase: SessionPhase;

	@Column({ type: 'boolean', default: false })
	@ApiProperty({
		required: true,
		example: false,
		description: 'Indicates if the session is premium',
		default: false,
	})
	premium: boolean;

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
}
