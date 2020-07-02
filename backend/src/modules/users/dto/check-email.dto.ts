import { IsString, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckEmailDto {
	@IsString()
	@IsEmail()
	@Length(4, 32)
	@ApiProperty({
		required: true,
		description: 'Email of the user',
		example: 'anonymous@ft.tech',
	})
	readonly email: string;
}
