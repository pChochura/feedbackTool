import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
	@IsString()
	@Length(16, 32)
	@ApiProperty({
		required: true,
		description: 'Unique seed created on the client side',
		example: 'l1fcqka1nm3fvw7j',
	})
	readonly seed: string;

	@IsString()
	@Length(3, 64)
	@ApiProperty({
		required: true,
		description: 'Name of the room',
		example: 'Anonymous',
	})
	readonly name: string;

	@IsString()
	@Length(16, 32)
	@ApiProperty({
		required: true,
		description: 'Link used to create a room',
		example: 'l1fcqka1nm3fvw7j',
	})
	readonly addLink: string;
}
