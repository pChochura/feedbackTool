import * as crypto from 'crypto';
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

export const generateId = (seed?: string) => {
	const generator: seedRandom.prng = seed ? seedRandom(seed) : seedRandom();
	return `${generator().toString(36).slice(2)}${generator()
		.toString(36)
		.slice(2)}`.slice(0, 16);
};

export const generateToken = () => {
	return crypto.randomBytes(128).toString('base64');
};

export const generateConfirmationLink = (email: string, token: string) => {
	const id = Buffer.from(JSON.stringify({ email, token }), 'utf-8').toString(
		'base64'
	);
	return `${process.env.CLIENT_URL}/email?token=${id}`;
};
