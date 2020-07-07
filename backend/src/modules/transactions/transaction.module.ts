import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { LoggerModule } from '../logger/logger.module';

@Module({
	imports: [TypeOrmModule.forFeature([Transaction]), LoggerModule],
	providers: [TransactionService],
	exports: [TransactionService],
})
export class TransactionModule {}
