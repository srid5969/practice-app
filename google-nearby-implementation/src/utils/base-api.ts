import { Response, Router } from 'express';
import logger from '../lib/logger';

/**
 * Provides services common to all API methods
 */
export default abstract class BaseApi {
	protected router: Router;

	protected constructor() {
		this.router = Router();
	}

	public abstract register(): void;

	/**
	 * Global method to send API response
	 * @param res
	 * @param statusCode
	 */
	public send(res: Response, statusCode: number = 200): void {
		let obj = {};
		obj = res.locals.data;

		res.status(statusCode).send(obj);
	}
}
