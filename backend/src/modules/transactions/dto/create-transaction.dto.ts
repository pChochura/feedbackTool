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

	@IsCurrency({ require_decimal: true, thousands_separator: '' })
	@ApiProperty({
		required: true,
		description: 'Bundle price',
		example: '9.99',
	})
	readonly unitPrice: string;

	@IsCurrency({ require_decimal: true, thousands_separator: '' })
	@ApiProperty({
		required: true,
		description: 'Discount',
		example: '9.99',
	})
	readonly discount: string;

	@IsNumber()
	@Max(10)
	@Min(1)
	@ApiProperty({
		required: true,
		description: 'Number of bundles bought',
		example: 2,
	})
	readonly bundleCount: number;

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
