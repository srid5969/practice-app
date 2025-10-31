import { Router } from 'express';
import PlacesController from '../components/places/places.controller';
import CronWebController from '../components/cron/cron.controller';

export default function registerRouters(): Router {
	const router = Router();

	// Register your routes here
	const placesController = new PlacesController();
	router.use('/places', placesController.register());

	// add CronWebController
	const cronWebController = new CronWebController();
	router.use('/cron', cronWebController.register());

	return router;
}
