import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class EmailService {
	constructor(
		private readonly mailerService: MailerService,
		private readonly loggerService: LoggerService
	) {
		this.loggerService.setContext('email.service');
	}

	async sendFeedback(email: string, content: string) {
		email = email || 'anonymous@ft.tech';

		this.loggerService.info('Feedback email sent', {
			email,
			content: content.substr(0, 20) + '...'
		});

		await this.mailerService.sendMail({
			to: process.env.RECEIVER_EMAIL,
			from: email,
			subject: `Feedback from ${email} <FeedbackTool>`,
			template: 'feedback',
			context: { email, content },
		});
	}

	async sendEmailConfirmation(email: string, token: string) {
		this.loggerService.info('Confirmation email sent', { email });

		await this.mailerService.sendMail({
			to: email,
			from: process.env.SENDER_EMAIL,
			subject: `Email confirmation <FeedbackTool>`,
			template: 'emailConfirmation',
			context: {
				email,
				confirmLink: `${process.env.CLIENT_URL}/email?id=${encodeURIComponent(
					token
				)}`,
			},
		});
	}
}
