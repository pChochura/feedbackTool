import { Response } from 'express';
export declare const sendResponse: (
	response: Response,
	message: object,
	statusCode?: number
) => void;
export declare const sendError: (response: Response, error: any) => void;
export declare const generateId: (seed?: string) => string;
