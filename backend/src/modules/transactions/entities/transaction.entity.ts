import {
	Entity,
	BaseEntity,
	PrimaryColumn,
	UpdateDateColumn,
	CreateDateColumn,
	Column,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'Transaction' })
export class Transaction extends BaseEntity {
	@PrimaryColumn({ type: 'varchar', length: 256, readonly: true })
	@ApiProperty({
		required: true,
		example: 'l1fcqka1nm3fvw7jl1fcqka1nm3fvw7jl1fcqka1nm3fvw7jl1fcqka1nm3fvw7j',
		description: 'Id of the transaction',
		readOnly: true,
	})
	id: string;

	@Column({ type: 'varchar', length: 16, readonly: true })
	@ApiProperty({
		required: true,
		example: 'l1fcqka1nm3fvw7j',
		description: 'Id of the user',
		readOnly: true,
	})
	userId: string;

	@Column({ type: 'varchar', length: 16, readonly: true })
	@ApiProperty({
		required: true,
		example: '18.98',
		description: 'Total amount paid',
		readOnly: true,
	})
	price: string;

	@Column({ type: 'varchar', length: 16, readonly: true, default: '9.99' })
	@ApiProperty({
		required: true,
		description: 'Bundle price',
		example: '9.99',
	})
	unitPrice: string;

	@Column({ type: 'varchar', length: 16, readonly: true, default: '0.00' })
	@ApiProperty({
		required: true,
		description: 'Discount',
		example: '-0.99',
	})
	discount: string;

	@Column({ type: 'integer', readonly: true, default: 1 })
	@ApiProperty({
		required: true,
		example: 2,
		description: 'Number of bundles bought',
		readOnly: true,
	})
	bundleCount: number;

	@Column({ type: 'integer', readonly: true })
	@ApiProperty({
		required: true,
		example: 20,
		description: 'Number of sessions bought',
		readOnly: true,
	})
	amount: number;

	@Column({ type: 'boolean', default: false })
	@ApiProperty({
		required: false,
		example: false,
		description: 'Indicates if the transaction was finalized',
		default: false,
	})
	finalized: boolean = false;

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
