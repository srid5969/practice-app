import { NextFunction, Request, Response, Router } from 'express';
import logger from '../../lib/logger';
import AppGlobalError from '../../utils/AppGlobalError';
import BaseApi from '../../utils/base-api';
import { SyncSaloonsService } from '../places/service';
import { HexagonNigeriaService } from '../../utils/nearby-service/nigeria-hexagon.service';
import { TestHexagonNigeriaService } from '../../utils/nearby-service/test';

export default class CronWebController extends BaseApi {
	constructor() {
		super();
	}

	public register(): Router {
		this.router.post(
			'/sync-geo-data',
			this.scheduleJobToSyncGeoData.bind(this),
		);
		return this.router;
	}

	public scheduleJobToSyncGeoData(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		const task = 'SYNC-GEO-DATA-TASK';

		try {
			logger.info(`${task} | Job scheduled successfully`);
			const syncSaloonsService = new TestHexagonNigeriaService();
			syncSaloonsService
				.startCollection()
				.catch((error) => {
					logger.error(
						`${task} | Error executing syncSaloonsWithHexagons: ${error}`,
					);
				})
				.catch((error) => {
					logger.error(
						`${task} | Error executing syncSaloonsWithHexagons: ${error}`,
					);
				});
		} catch (error) {
			logger.error(`${task} | Error scheduling job: ${error}`);
			return next(
				new AppGlobalError(
					error.message,
					error.statusCode,
					error.isOperational,
					error.stack,
				),
			);
		} finally {
			res.locals.data = {
				message: 'Salon Cron Functionality Success',
			};
			super.send(res);
		}
	}
}
