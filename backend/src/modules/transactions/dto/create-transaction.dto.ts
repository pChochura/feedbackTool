import {
	IsString,
	Length,
	IsCurrency,
	IsNumber,
	Max,
	Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
	@IsString()
	@Length(16, 32)
	@ApiProperty({
		required: true,
		description: 'Id of the user',
		example: 'l1fcqka1nm3fvw7j',
	})
	readonly userId: string;

	@IsCurrency({ require_decimal: true, thousands_separator: '' })
	@ApiProperty({
		required: true,
		description: 'Total amount paid',
		example: '9.99',
	})
	readonly price: string;

	@IsNumber()
	@Max(100)
	@Min(10)
	@ApiProperty({
		required: true,
		description: 'Number of sessions bought',
		example: 10,
	})
	readonly amount: number;
}
