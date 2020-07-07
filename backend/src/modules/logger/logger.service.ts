import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as stackTraceParser from 'stacktrace-parser';

const DEFAULT_CHANNEL = 'system';

@Injectable({ scope: Scope.REQUEST })
export class LoggerService {
	private readonly data: {
		requestId: string;
		requestUrl: string;
		hostname: string;
		ip: string;
		method: string;
	};
	private readonly logger: winston.Logger;

	private currentChannel = DEFAULT_CHANNEL;

	constructor(@Inject(REQUEST) request: Request) {
		this.data = {
			requestId: request.get('X-Correlation-Id'),
			requestUrl: request.url,
			hostname: request.hostname,
			method: request.method,
			ip: request.ip,
		};

		this.logger = winston.createLogger({
			format: winston.format.combine(
				winston.format.ms(),
				winston.format.timestamp(),
				winston.format.json()
			),
			transports: this.getTransports(),
		});
	}

	private getTransports(channel: string = DEFAULT_CHANNEL) {
		return [
			new DailyRotateFile({
				extension: '.log',
				dirname: 'logs',
				filename: `${channel}-%DATE%`,
			}),
		];
	}

	setContext(channel: string) {
		this.currentChannel = channel;
		this.logger.configure({
			transports: this.getTransports(channel),
		});
	}

	log(
		message: string,
		level: string = 'info',
		customProperties: any = {},
		channel?: string
	) {
		if (channel && this.currentChannel !== channel) {
			this.logger.configure({
				transports: this.getTransports(channel),
			});
		}

		this.logger.log(level, message, {
			...this.data,
			customProperties,
		});
	}

	info(message: string, customProperties: any = {}, channel?: string) {
		this.log(message, 'info', customProperties, channel);
	}

	debug(message: string, customProperties: any = {}, channel?: string) {
		this.log(message, 'debug', customProperties, channel);
	}

	warning(message: string, customProperties: any = {}, channel?: string) {
		this.log(message, 'warn', customProperties, channel);
	}

	exception(
		message: string,
		exception?: Error,
		customProperties: any = {},
		channel?: string
	) {
		this.log(
			message,
			'error',
			{
				...customProperties,
				exception: {
					message: exception.message,
					name: exception.name,
					stack: stackTraceParser.parse(exception.stack || ''),
				},
			},
			channel
		);
	}
}
