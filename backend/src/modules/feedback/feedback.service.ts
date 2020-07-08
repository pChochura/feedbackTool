import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Repository } from 'typeorm';
import { EmailService } from '../emails/email.service';

@Injectable()
export class FeedbackService {
	constructor(
		@InjectRepository(Feedback)
		private readonly feedbackRepository: Repository<Feedback>,
		private readonly emailService: EmailService
	) {}

	async send(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
		const feedback = this.feedbackRepository.create(createFeedbackDto);
		await feedback.save();

		await this.emailService.sendFeedback(
			createFeedbackDto.email,
			createFeedbackDto.content,
			feedback.createdAt
		);

		return feedback;
	}
}
