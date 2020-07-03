import { IsString, Length, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
	@IsString()
	@IsEmail()
	@Length(4, 32)
	@ApiProperty({
		required: true,
		description: 'Email of the user',
		example: 'anonymous@ft.tech',
	})
	readonly email: string;

	@IsString()
	@Length(32, 64)
	@ApiProperty({
		required: true,
		description: 'Hashed secret',
		example: 'af9bb7f9a757f8d13ea63852f254c12g',
	})
	readonly secret: string;
}
