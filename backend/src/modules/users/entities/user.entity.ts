import {
	BaseEntity,
	Entity,
	PrimaryColumn,
	Column,
	UpdateDateColumn,
	CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'User' })
export class User extends BaseEntity {
	@PrimaryColumn({ type: 'varchar', length: 16, readonly: true })
	@ApiProperty({
		required: true,
		example: 'l1fcqka1nm3fvw7j',
		description: 'Id of the user',
		readOnly: true,
	})
	id: string;

	@Column({ length: 16, nullable: true })
	@ApiProperty({
		required: false,
		example: 'l1fcqka1nm3fvw7j',
		description: 'Id of the associated session',
		nullable: true,
	})
	sessionId?: string;

	@Column({ length: 256, nullable: true })
	@ApiProperty({
		required: false,
		example: 'l1fcqka1nm3fvw7jl1fcqka1nm3fvw7jl1fcqka1nm3fvw7jl1fcqka1nm3fvw7j',
		description: 'Session token used to indicate if the user is logged in',
		nullable: true,
	})
	sessionToken?: string;

	@Column({ length: 64, readonly: true, nullable: true })
	@ApiProperty({
		required: false,
		example: 'anonymous@ft.tech',
		description: 'Email of the user',
		readOnly: true,
		nullable: true,
	})
	email?: string;

	@Column({ length: 256, readonly: true, nullable: true })
	@ApiProperty({
		required: false,
		example: 'af9bb7f9a757f8d13ea63852f254c1227b48b9dbb308eae585b3612b61d85ce0',
		description: 'Hashed secret',
		readOnly: true,
		nullable: true,
	})
	secret?: string;

	@Column({ type: 'integer', nullable: true })
	@ApiProperty({
		required: false,
		example: 7,
		description: 'Number of premium sessions left',
		nullable: true,
	})
	premiumSessionsLeft?: number;

	@Column({ type: 'boolean', default: true })
	@ApiProperty({
		required: false,
		example: true,
		description: 'Indicates if the user was created temporarily',
	})
	temporary?: boolean;

	@Column({ type: 'boolean', nullable: true })
	@ApiProperty({
		required: false,
		example: false,
		description: "Indicates if the user confirmed thier's email",
		nullable: true,
	})
	confirmed?: boolean;

	@UpdateDateColumn()
	@ApiProperty({
		required: true,
		example: '1590320753',
		description: 'Time indicating when the last update occured',
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
