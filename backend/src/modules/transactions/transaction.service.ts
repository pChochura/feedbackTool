import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { generateToken } from '../../common';
import { LoggerService } from '../logger/logger.service';

export class TransactionService {
	constructor(
		@InjectRepository(Transaction)
		private readonly transactionRepository: Repository<Transaction>,
		private readonly loggerService: LoggerService
	) {
		this.loggerService.setContext('transaction.service');
	}

	async create(
		createTransactionDto: CreateTransactionDto
	): Promise<Transaction> {
		const transaction = await this.transactionRepository
			.create({
				...createTransactionDto,
				id: generateToken(),
			})
			.save();

		this.loggerService.info('Transaction created', {
			userId: createTransactionDto.userId,
			amount: createTransactionDto.amount,
			price: createTransactionDto.price,
		});

		return transaction;
	}
}
