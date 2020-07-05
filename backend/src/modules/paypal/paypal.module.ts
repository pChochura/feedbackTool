import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { TransactionModule } from '../transactions/transaction.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
	imports: [TransactionModule, LoggerModule],
	providers: [PaypalService],
	exports: [PaypalService],
})
export class PaypalModule { }
