import { NextFunction, Request, Response, Router } from 'express';
import logger from '../../lib/logger';
import AppGlobalError from '../../utils/AppGlobalError';
import BaseApi from '../../utils/base-api';
import {
	placesService,
	PlacesService,
} from '../../utils/nearby-service/get-nearby-places.api.service';
import {
	database,
	PlacesFirebaseDatabase,
} from '../../utils/firebase/firebase.database';
import { HexagonService } from '../../utils/nearby-service/hexagon.service';

export default class PlacesController extends BaseApi {
	private placesService: PlacesService;

	constructor() {
		super();
		this.placesService = placesService;
	}

	public register(): Router {
		this.router.get('/test-integration', this.testPlacesIntegration);
		this.router.get('/', this.getAllPlaces);
		this.router.get('/saloons', this.getAllSaloons.bind(this));
		// import saloon routes here
		this.router.post('/saloons', this.importSaloons.bind(this));
		return this.router;
	}

	public async importSaloons(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		const task = 'IMPORT-SALOONS';
		try {
			logger.info(`${task} | Starting saloon import process`);

			const saloonsData = req.body;
			logger.trace(`${task} | Saloons data to import:`, saloonsData);

			const importResults = [];
			for (const saloon of saloonsData) {
				const saloonId = saloon.id;
				await database.collection('saloons').doc(saloonId).set(saloon);
				importResults.push({ saloonId, status: 'imported' });
			}

			res.locals.data = {
				message: 'Saloons imported successfully',
				totalImported: importResults.length,
				results: importResults,
			};
		} catch (error) {
			logger.error(`${task} | Error importing saloons: ${error.message}`);
			return next(
				new AppGlobalError(
					error.message,
					error.statusCode || 500,
					error.isOperational || false,
					error.stack,
				),
			);
		} finally {
			super.send(res);
		}
	}

	public async getAllSaloons(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		const task = 'GET-ALL-SALOONS';
		try {
			logger.info(`${task} | Fetching all saloons from service`);
			logger.trace(`${task} | Query params:`, req.query);

			const { lat, lng, radius } = req.query;
			logger.trace(
				`${task} | Query params - lat: ${lat}, lng: ${lng}, radius: ${radius}`,
			);

			const saloons = await database.collection('saloonsv2').get();
			logger.trace(
				`${task} | Fetched saloons:`,
				saloons.docs.map((doc) => doc.data()),
			);
			// Filter saloons based on query params
			const filteredSaloons = saloons.docs.filter((doc) => {
				const data = doc.data();
				console.log('Saloon data:', data);

				if (lat && lng && radius && data?.location && data?.location?.lat && data?.location?.lng) {
					const distance = HexagonService.calculateDistance(
						data.location.lat,
						data.location.lng,
						parseFloat(lat as string),
						parseFloat(lng as string),
					);
					return distance <= parseFloat(radius as string);
				}
				return true;
			});
			logger.trace(
				`${task} | Filtered saloons:`,
				filteredSaloons.map((doc) => doc.data()),
			);

			const result = {
				message: 'Fetched all saloons successfully',
				totalSaloons: saloons.size,
				resultCount: filteredSaloons.length,
				data: filteredSaloons.map((doc) => doc.data()),
			};

			res.locals.data = result;
		} catch (error) {
			logger.error(
				`${task} | Error fetching all saloons: ${error.message}`,error
			);
			return next(
				new AppGlobalError(
					error.message,
					error.statusCode || 500,
					error.isOperational || false,
					error.stack,
				),
			);
		} finally {
			super.send(res);
		}
	}

	public async testPlacesIntegration(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		const task = 'TEST-PLACES-INTEGRATION';

		try {
			logger.info(`${task} | Starting places integration test`);

			// Test with a known location (example: Lagos, Nigeria)
			const location = { lat: 5.7254387, lng: 7.7301536 };
			const radius = 5000000; // 50 km

			logger.info(`${task} | Searching for places near Lagos...`);
			const results = await this.placesService.getAllResults(
				location,
				radius,
			);
			logger.trace(`${task} | Found results:`, results);

			logger.info(`${task} | Found ${results.length} total places`);

			const transformedResults = results.map((place) =>
				this.placesService.transformPlace(place),
			);

			// store in firebase
			for (const place of transformedResults) {
				await database
					.collection('saloons')
					.doc(place.placeId)
					.set(place);
			}

			res.locals.data = {
				message: 'Places integration test successful',
				totalResults: results.length,
				data: results,
			};
		} catch (error) {
			logger.error(
				`${task} | Error testing places integration: ${error.message}`,
			);
			return next(
				new AppGlobalError(
					error.message,
					error.statusCode || 500,
					error.isOperational || false,
					error.stack,
				),
			);
		} finally {
			super.send(res);
		}
	}

	public async getAllPlaces(req: Request, res: Response, next: NextFunction) {
		const task = 'GET-ALL-PLACES';
		try {
			logger.info(`${task} | Fetching all places from service`);

			const places = await PlacesFirebaseDatabase.listAllPlaces();

			res.locals.data = {
				message: 'Fetched all places successfully',
				totalPlaces: places.length,
				data: places,
			};
		} catch (error) {
			logger.error(
				`${task} | Error fetching all places: ${error.message}`,
			);
			return next(
				new AppGlobalError(
					error.message,
					error.statusCode || 500,
					error.isOperational || false,
					error.stack,
				),
			);
		} finally {
			super.send(res);
		}
	}
}
