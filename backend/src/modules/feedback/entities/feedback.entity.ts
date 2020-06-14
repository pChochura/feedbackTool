import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'Feedback' })
export class Feedback extends BaseEntity {
	@PrimaryGeneratedColumn('increment')
	@ApiProperty({
		required: true,
		example: 2,
		description: 'Increment id of the feedback',
		readOnly: true,
	})
    id: number;

	@Column({ type: 'varchar', length: 512, readonly: true })
	@ApiProperty({
		required: true,
		example: 'Content of the feedback',
		description: 'Content of the feedback',
		readOnly: true,
	})
	content: string;

	@Column({ type: 'varchar', length: 32, readonly: true })
	@ApiProperty({
		required: false,
		example: 'anonymous@ft.tech',
		description: 'Email to the person who send the feedback',
		readOnly: true,
	})
	email: string;

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