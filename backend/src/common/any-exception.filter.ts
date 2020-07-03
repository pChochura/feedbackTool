import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { sendResponse } from '.';
import * as stackTraceParser from 'stacktrace-parser';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const trace = stackTraceParser.parse(exception.stack || '');

		sendResponse(
			response,
			{
				message: exception.message || 'Something went wrong',
				timestamp: new Date().toISOString(),
				url: request.url,
				stacktrace: trace,
				status: exception.status || HttpStatus.INTERNAL_SERVER_ERROR,
			},
			exception.status || HttpStatus.INTERNAL_SERVER_ERROR
		);
	}
}
