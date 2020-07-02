import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
	constructor(private readonly mailerService: MailerService) { }

	async sendFeedback(email: string, content: string) {
		email = email || 'anonymous@ft.tech';

		console.log(email, content);

		await this.mailerService.sendMail({
			to: process.env.RECEIVER_EMAIL,
			from: email,
			subject: `Feedback from ${email} <FeedbackTool>`,
			template: 'feedback',
			context: { email, content },
		});
	}

	async sendEmailConfirmation(email: string, token: string) {
		await this.mailerService.sendMail({
			to: email,
			from: process.env.SENDER_EMAIL,
			subject: `Email confirmation <FeedbackTool>`,
			template: 'emailConfirmation',
			context: { email, confirmLink: `${process.env.CLIENT_URL}/email?id=${encodeURIComponent(token)}` },
		});
	}
}
