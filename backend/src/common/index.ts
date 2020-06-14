import * as seedRandom from 'seedrandom';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export const sendResponse = (
	response: Response,
	message: object,
	statusCode: number = HttpStatus.OK
) => {
	response.status(statusCode).json(message);
};

export const sendError = (response: Response, error: any) => {
	sendResponse(
		response,
		{ message: (error && error.message) || 'Something went wrong' },
		(error && error.status) || HttpStatus.BAD_REQUEST
	);
};

export const generateId = (seed?: string) => {
	const generator: seedRandom.prng = seed ? seedRandom(seed) : seedRandom();
	return `${generator().toString(36).slice(2)}${generator()
		.toString(36)
		.slice(2)}`.slice(0, 16);
};
