import { IsString, Length, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
	@IsString()
	@Length(16, 32)
	@ApiProperty({
		required: true,
		description: 'Unique seed created on the client side',
		example: 'l1fcqka1nm3fvw7j',
	})
	readonly seed: string;

	@IsBoolean()
	@ApiProperty({
		required: false,
		description: 'Forces free session even if the user can create premium one',
		example: true,
	})
	readonly forceFree?: boolean;
}
