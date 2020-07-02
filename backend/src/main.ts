import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as CookieParser from 'cookie-parser';
import { AnyExceptionFilter } from './common/any-exception.filter';
require('dotenv').config();

declare const module: any;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalFilters(new AnyExceptionFilter());
	app.useGlobalPipes(new ValidationPipe());
	app.use(CookieParser('secret'));
	app.enableCors({
		origin: process.env.CLIENT_URL,
		credentials: true,
		exposedHeaders: 'WWW-Authenticate',
	});

	const document = SwaggerModule.createDocument(
		app,
		new DocumentBuilder()
			.setTitle('FeedbackTool API')
			.setDescription('API for FeedbackTool')
			.setVersion('1.0.0')
			.build()
	);
	SwaggerModule.setup('api/v1/docs', app, document);

	if (!module.parent) {
		await app.listen(8000);
	}

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}
bootstrap();
