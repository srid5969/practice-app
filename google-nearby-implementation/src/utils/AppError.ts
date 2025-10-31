export interface IError {
	statusCode: number;
	message: string;
	isOperational: boolean;
}

class AppError extends Error implements IError {
	public statusCode = 500;

	public isOperational: boolean;

	constructor(
		message: string,
		statusCode: number,
		isOperational: boolean = false,
	) {
		super(message);
		this.message = message;
		this.statusCode = statusCode;
		this.isOperational = isOperational;
	}
}

export default AppError;
