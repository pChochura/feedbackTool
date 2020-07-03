import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { TransactionModule } from '../transactions/transaction.module';

@Module({
	imports: [TransactionModule],
	providers: [PaypalService],
	exports: [PaypalService],
})
export class PaypalModule {}
