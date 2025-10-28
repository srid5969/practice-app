export interface IError {
	resMsg: string;
	resStatusCode: number;
	isOperational: boolean;
	stackErr?: string;
}

class AppGlobalError extends Error implements IError {
	public resMsg: string;

	public resStatusCode = 500;

	public isOperational: boolean;

	public stackErr: string;

	constructor(
		resMsg: string,
		resStatusCode: number,
		isOperational: boolean = true,
		stackErr?: string,
	) {
		super(resMsg);
		this.resMsg = resMsg;
		this.resStatusCode = resStatusCode;
		this.isOperational = isOperational;
		this.stackErr = stackErr;

		Object.setPrototypeOf(this, AppGlobalError.prototype);
		Error.captureStackTrace(this, this.constructor);
	}
}

export default AppGlobalError;
