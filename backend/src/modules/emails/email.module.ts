import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { EmailService } from './email.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
	imports: [
		MailerModule.forRoot({
			transport: {
				host: process.env.SMTP_HOST,
				port: process.env.SMTP_PORT,
				auth: {
					user: process.env.SMTP_USER,
					pass: process.env.SMTP_PASS,
				},
			},
			template: {
				dir: process.cwd() + '/templates/',
				adapter: new EjsAdapter(),
			},
		}),
		LoggerModule,
	],
	providers: [EmailService],
	exports: [EmailService],
})
export class EmailModule {}
