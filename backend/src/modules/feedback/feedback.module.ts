import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { EmailModule } from '../emails/email.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
	imports: [TypeOrmModule.forFeature([Feedback]), EmailModule, LoggerModule],
	providers: [FeedbackService],
	controllers: [FeedbackController],
})
export class FeedbackModule { }
