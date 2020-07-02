import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { generateToken } from '../../common';

export class TransactionService {
    constructor(@InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>) { }

    async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        return this.transactionRepository.create({
            ...createTransactionDto,
            id: generateToken(),
        }).save();
    }
}