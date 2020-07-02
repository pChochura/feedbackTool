import { Min, Max, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
	@Min(1)
	@Max(10)
	@IsNumber()
	@IsOptional()
	@ApiProperty({
		required: false,
		description: 'Number of bundles',
		example: 7,
		default: 1,
	})
	readonly amount?: number = 1;

	@IsString()
	@IsOptional()
	@ApiProperty({
		required: false,
		description: 'Registration session token',
		example:
			'C8oLttdjAWQ2HU+FsP2Rf7N2w/X10f4QTtv+X7YkScgXkGtZCEuNpDEdTLgojlw7MLsQF4xGGxG39/IzRe7FsiY38a78k++dAz/5VxC76owLiWoh0MFDWTklYQGvE9r6V37pNwst4O1Ob5XGeXOPunoIH8gD37ijFd0uk1/uizg=',
	})
	readonly token?: string;
}
