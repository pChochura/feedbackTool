import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class FeedbackService {
	constructor(
		@InjectRepository(Feedback)
		private readonly feedbackRepository: Repository<Feedback>,
		private readonly mailerService: MailerService
	) {}

	async send(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
		const feedback = this.feedbackRepository.create(createFeedbackDto);
		await feedback.save();

		await this.mailerService.sendMail({
			to: process.env.EMAIL,
			from: createFeedbackDto.email || 'anonymous@ft.tech',
			subject: `Feedback from ${
				createFeedbackDto.email || 'anonymous@ft.tech'
			} <FeedbackTool>`,
			template: 'feedback',
			context: {
				from: createFeedbackDto.email || 'anonymous@ft.tech',
				content: createFeedbackDto.content,
			},
		});

		return feedback;
	}
}
