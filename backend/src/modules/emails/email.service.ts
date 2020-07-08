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

	async sendFeedback(email: string, content: string, createdAt: Date) {
		email = email || 'anonymous@feedbacktool.tech';
		const name = email.substring(0, email.indexOf('@'));

		this.loggerService.info('Feedback email sent', {
			email,
			content: content.substr(0, 20) + '...',
		});

		await this.mailerService.sendMail({
			to: process.env.RECEIVER_EMAIL,
			from: process.env.SENDER_EMAIL,
			subject: `Feedback from ${name} <FeedbackTool>`,
			template: 'feedback',
			context: {
				name,
				email,
				responseSubject: encodeURIComponent('Feedback reponse'),
				responseBody: encodeURIComponent(
					`Response for your feedback: \n> ${content.replace(
						/\n/g,
						'\n> '
					)}\n\n`
				),
				content: content,
				date: createdAt.toDateString(),
				url: process.env.CLIENT_URL,
			},
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
				url: process.env.CLIENT_URL,
			},
		});
	}

	async sendPayment(
		email: string,
		unitPrize: string,
		quantity: number,
		discount: string,
		total: string
	) {
		this.loggerService.info('Payment email sent', {
			unitPrize,
			quantity,
			discount,
		});

		await this.mailerService.sendMail({
			to: email,
			from: process.env.SENDER_EMAIL,
			subject: `Purchase summary <FeedbackTool>`,
			template: 'payment',
			context: {
				url: process.env.CLIENT_URL,
				unitPrize,
				quantity,
				discount,
				total,
			},
		});
	}
}
