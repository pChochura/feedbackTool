import { BaseEntity, Entity, PrimaryColumn, Column } from 'typeorm';
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

	@Column({ name: 'sessionId', length: 16, readonly: true })
	@ApiProperty({
		required: true,
		example: 'l1fcqka1nm3fvw7j',
		description: 'Id of the associated session',
		readOnly: true,
	})
	sessionId: string;
}
