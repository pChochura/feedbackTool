import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
	imports: [
		TypeOrmModule.forFeature([Feedback]),
		MailerModule.forRoot({
			transport: {
				host: process.env.SMTP_HOST,
				port: process.env.SMTP_PORT,
				auth: {
					user: process.env.SMTP_USER,
					pass: process.env.SMTP_PASS,
				},
			},
			defaults: {
				from: 'Anonymous <anonymous@ft.tech>',
			},
			template: {
				dir: process.cwd() + '/templates/',
				adapter: new EjsAdapter(),
			},
		}),
	],
	providers: [FeedbackService],
	controllers: [FeedbackController],
})
export class FeedbackModule {}
