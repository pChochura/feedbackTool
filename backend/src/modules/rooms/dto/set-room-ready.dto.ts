import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetRoomReadyDto {
	@IsBoolean()
	@ApiProperty({
		required: true,
		description: 'Indicates if the room have to be marked as ready or not',
		example: false,
	})
	readonly ready: boolean;
}
