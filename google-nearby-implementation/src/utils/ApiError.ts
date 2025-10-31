import { Request, Response } from 'express';
import logger from '../lib/logger';

export interface IError {
	status: number;
	fields: {
		name: {
			message: string;
		};
	};
	message: string;
	name: string;
}

class ApiError extends Error implements IError {
	public status = 500;

	public success = false;

	public fields: { name: { message: string } };

	constructor(
		msg: string,
		statusCode: number,
		res: Response,
		req: Request,
		errMessage: string = 'Manaul Error',
		errStack: string = 'Manaul Error',
		name: string = 'ApiError',
	) {
		super();
		this.message = msg;
		this.status = statusCode;
		this.name = name;

		logger.error('[API ERROR]', {
			message: msg,
			statusCode,
			errorDetails: {
				name,
				errMessage,
				errStack,
			},
			request: {
				method: req.method,
				url: req.url,
				headers: req.headers,
				body: req.body,
			},
			responseStatusCode: res.statusCode,
			userDetails: req?.user_details ?? 'GUEST-MODE',
		});

		res.status(statusCode).json({
			message: msg,
		});
	}
}

export default ApiError;
