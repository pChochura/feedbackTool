import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsBoolean, IsOptional } from 'class-validator';

export class SubmitNoteDto {
	@IsString()
	@Length(16, 32)
	@IsOptional()
	@ApiProperty({
		required: false,
		description:
			'Id of the note to be edited. If omitted a new note will be created',
		example: 'l1fcqka1nm3fvw7j',
	})
	readonly id?: string;

	@IsString()
	@Length(16, 32)
	@ApiProperty({
		required: true,
		description: 'Id of the list',
		example: 'l1fcqka1nm3fvw7j',
	})
	readonly listId: string;

	@IsString()
	@Length(1, 512)
	@ApiProperty({
		required: true,
		description: 'Content of the note',
		example: 'My awesome note',
	})
	readonly note: string;

	@IsBoolean()
	@ApiProperty({
		required: false,
		description: 'Indicates if the rating is positive or negative',
		example: false,
		default: true,
	})
	readonly positive: boolean = true;
}
