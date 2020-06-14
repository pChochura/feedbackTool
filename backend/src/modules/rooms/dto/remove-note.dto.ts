import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveNoteDto {
	@IsString()
	@Length(16, 32)
	@ApiProperty({
		required: true,
		description: 'Id of the note',
		example: 'l1fcqka1nm3fvw7j',
	})
	readonly id: string;

	@IsString()
	@Length(16, 32)
	@ApiProperty({
		required: true,
		description: 'Id of the list',
		example: 'l1fcqka1nm3fvw7j',
	})
	readonly listId: string;
}
