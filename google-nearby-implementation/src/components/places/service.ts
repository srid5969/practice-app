import logger from '../../lib/logger';
import { HEXAGON_RESOLUTION } from '../../utils/constants';
import { database } from '../../utils/firebase/firebase.database';
import { PlacesService } from '../../utils/nearby-service/get-nearby-places.api.service';
import { HexagonService } from '../../utils/nearby-service/hexagon.service';
import { RateLimiter } from '../../utils/rate-limiter';

export class SyncSaloonsService {
	private hexagonService: HexagonService;
	private rateLimiter: RateLimiter;
	private placesService: PlacesService;
	private currentProgress: Partial<{
		totalHexagons: number;
		processedHexagons: number;
		totalResults: number;
		startTime: number | null;
		status: 'idle' | 'running' | 'completed';
	}>;
	private isRunning: boolean = false;

	constructor() {
		this.hexagonService = new HexagonService();
		this.placesService = new PlacesService();
		this.rateLimiter = new RateLimiter(
			// req per sec
			10,
			// max concurrent
			5,
		);
		this.isRunning = false;
		this.currentProgress = {
			totalHexagons: 0,
			processedHexagons: 0,
			totalResults: 0,
			startTime: null,
			status: 'idle',
		};
	}

	private async saveResults(results: any): Promise<void> {
		// store in firestore
		const collectionName = 'saloons';
		// const batch = database.batch();
		// results.forEach((place) => {
		//   const docRef = database.collection(collectionName).doc(place.place_id);
		//   batch.set(docRef, place);
		// });
		// await batch.commit();
		// logger.info(`Saved ${results.length} places to Firestore collection '${collectionName}'`);
		const docRef = database.collection(collectionName).doc();
		await docRef.set(results);
		logger.info(
			`Saved results to Firestore collection '${collectionName}' with ID: ${docRef.id}`,
		);
	}

	public async syncSaloonsWithHexagons(
		options: any = {},
		mapsConfig: any = {},
	) {
		try {
			const seenPlaceIds = new Set<string>();
			const allResults: any[] = [];

			this.currentProgress = {
				processedHexagons: 0,
				totalResults: 0,
				startTime: Date.now(),
				status: 'running',
			};
			this.isRunning = true;
			// const saloons = await database.collection('saloons').get();

			const hexagons = new HexagonService().generateHexagons();
			for (const hexagon of hexagons) {
				// Generate hexagons based on scope

				const hexagon = hexagons;
				logger.info(
					`Processing hexagon ${hexagons.findIndex((h) => h === hexagon) + 1}/${hexagons.length}: ${hexagon}`,
				);

				const center = this.hexagonService.getHexagonCenter(hexagon);
				// Use rate limiter to fetch results
				const results = await this.rateLimiter.execute(
					async () => await this.placesService.getAllResults(center),
				);

				// Filter duplicates and transform results
				const uniqueResults = results
					.filter((place) => {
						if (seenPlaceIds.has(place.place_id)) {
							return false;
						}
						seenPlaceIds.add(place.place_id);
						return true;
					})
					.map((place) => this.placesService.transformPlace(place));
				logger.info(
					`Hexagon ${hexagon} processed: ${uniqueResults.length} unique results`,
				);

				allResults.push(...uniqueResults);

				this.currentProgress.processedHexagons =
					hexagons.findIndex((h) => h === hexagon) + 1;
				this.currentProgress.totalResults = allResults.length;

				logger.info(
					`Hexagon ${hexagon} processed: ${uniqueResults.length} unique results`,
				);
			}

			// Save results to JSON file
			const results = {
				collectionDate: new Date().toISOString(),
				hexagonResolution: HEXAGON_RESOLUTION,
				totalHexagons: this.currentProgress.processedHexagons,
				totalPlaces: allResults.length,
				places: allResults,
				metadata: {
					rateLimiterStats: this.rateLimiter.getStats(),
					runtime:
						(
							(Date.now() - this.currentProgress.startTime) /
							1000
						).toFixed(2) + ' seconds',
				},
			};
			logger.info('Collection completed successfully', {
				totalPlaces: allResults.length,
				runtime: results.metadata.runtime,
			});

			await this.saveResults(results);

			this.currentProgress.status = 'completed';
			this.isRunning = false;

			logger.info('Collection completed successfully', {
				totalPlaces: allResults.length,
				runtime: results.metadata.runtime,
			});

			return results;
			// await database
			// 	.collection('saloons')
			// 	.doc(doc.id)
			// 	.set(transformedSaloon);
		} catch (error) {
			logger.trace(`Error in syncSaloonsWithHexagons: ${error.message}`);
			logger.error(`Error in syncSaloonsWithHexagons: ${error.message}`, { error });
			this.currentProgress.status = 'idle';
			this.isRunning = false;
			throw error;
		}
	}
}
