


import { Place } from '@googlemaps/google-maps-services-js';
import { env } from '../../environment';
import logger from '../../lib/logger';
import { HEXAGON_RESOLUTION, locationConfig, nigeriaConfig } from '../constants';
import { RateLimiter } from '../rate-limiter';
import { PlacesService } from './get-nearby-places.api.service';
import { database } from '../firebase/firebase.database';

const h3 = require('h3-js');

interface CollectionOptions {
	testMode?: boolean;
}

interface Progress {
	status: 'idle' | 'running' | 'completed' | 'error';
	startTime?: number;
	totalHexagons?: number;
	processedHexagons?: number;
	totalResults?: number;
}
export class HexagonNigeriaService {
	private resolution: number;
	private isRunning: boolean = false;
	private currentProgress: Progress = { status: 'idle' };
	private hexagonService: any;
	private rateLimiter: RateLimiter;
	private placesService: PlacesService;

	constructor(resolution = HEXAGON_RESOLUTION) {
		this.resolution = HEXAGON_RESOLUTION;
        this.isRunning = false;
        this.placesService = new PlacesService();
        this.rateLimiter = new RateLimiter(10, 5); // 10 req/sec, max 5 concurrent
	}


	async startCollection(options: CollectionOptions = {}) {
		this.isRunning = true;
		this.currentProgress.status = 'running';
		this.currentProgress.startTime = Date.now();

		try {
			logger.info('Starting salon data collection');

			// Generate hexagons based on scope

            // options.testMode 
			// 	? this.getAllTestCitiesHexagons()
			const hexagons = 
				this.generateNigeriaHexagons();

			this.currentProgress.totalHexagons = hexagons.length;

			const allResults: any[] = [];
			const seenPlaceIds = new Set<string>();
            logger.info(`Total hexagons to process: ${hexagons.length}`);

			// Process each hexagon
			for (let i = 0; i < hexagons.length; i++) {
				const hexagon = hexagons[i];
				logger.info(`Processing hexagon ${i + 1}/${hexagons.length}: ${hexagon}`);

				const center = this.getHexagonCenter(hexagon);

                logger.info(`Fetching places for center: ${JSON.stringify(center)}`);

				// Use rate limiter to fetch results
				const results = await this.rateLimiter.execute(
					async () => await this.placesService.getAllResults(center)
				);

                logger.info(`Fetched ${results.length} places for center: ${JSON.stringify(center)}`);

				// Filter duplicates and transform results
				const uniqueResults = results
					.filter((place: any) => {
						if (seenPlaceIds.has(place.place_id)) {
							return false;
						}
						seenPlaceIds.add(place.place_id);
						return true;
					})
					.map((place: any) => this.placesService.transformPlace(place));

				allResults.push(...uniqueResults);

				this.currentProgress.processedHexagons = i + 1;
				this.currentProgress.totalResults = allResults.length;

				logger.info(`Hexagon ${i + 1} processed: ${uniqueResults.length} unique results`);

				// Stop if in test mode and we have enough results
				if (options.testMode && allResults.length > 50) {
					logger.info('Test mode: stopping collection with sufficient results');
					break;
				}
			}

			// Save results to JSON file
			const finalResults = {
				data: allResults,
				metadata: {
					collectionDate: new Date().toISOString(),
					hexagonResolution: this.resolution,
					totalHexagons: this.currentProgress.processedHexagons,
					totalResults: allResults.length,
					runtime: ((Date.now() - (this.currentProgress.startTime || 0)) / 1000).toFixed(2) + ' seconds'
				}
			};

			await this.saveResults(finalResults);

			this.currentProgress.status = 'completed';
			this.isRunning = false;

			logger.info('Collection completed successfully', {
				totalPlaces: allResults.length,
				runtime: finalResults.metadata.runtime
			});

			return finalResults;

		} catch (error) {
			logger.error('Error in collection process', error);
			this.currentProgress.status = 'error';
			this.isRunning = false;
			throw error;
		}
	}

	/**
	 * Extract hexagons from GeoJSON coordinates
	 * @param geojson - GeoJSON object
	 * @param hexagons - Set to add hexagons to
	 */
	extractHexagonsFromGeoJSON(geojson: any, hexagons: Set<string>): void {
		const processCoordinates = (coords: any) => {
			if (typeof coords[0] === 'number') {
				// It's a single coordinate [lng, lat]
				const [lng, lat] = coords;
				const h3Index = h3.latLngToCell(lat, lng, this.resolution);
				hexagons.add(h3Index);
			} else {
				// It's an array of coordinates
				coords.forEach(processCoordinates);
			}
		};

		geojson.features.forEach((feature: any) => {
			if (feature.geometry && feature.geometry.coordinates) {
				processCoordinates(feature.geometry.coordinates);
			}
		});
	}

	/**
	 * Get center coordinates of a hexagon
	 * @param h3Index - H3 index
	 * @returns {lat, lng} object
	 */
	getHexagonCenter(h3Index: string): { lat: number; lng: number } {
		const [lat, lng] = h3.cellToLatLng(h3Index);
		return { lat, lng };
	}

	/**
	 * Get boundary coordinates of a hexagon
	 * @param h3Index - H3 index
	 * @returns Array of [lat, lng] coordinates
	 */
	getHexagonBoundary(h3Index: string): number[][] {
		return h3.cellToBoundary(h3Index);
	}

	/**
	 * Get hexagons for a specific test city
	 * @param {string} cityName - Name of the city
	 * @returns {Array} Array of H3 indexes around the city
	 */
	// getTestCityHexagons(cityName) {
	// 	const city = nigeriaConfig.testCities.find((c) => c.name === cityName);

	// 	if (!city) {
	// 		logger.error(`City ${cityName} not found`);
	// 		return [];
	// 	}

	// 	const centerHex = h3.latLngToCell(city.lat, city.lng, this.resolution);
	// 	const hexagons = h3.gridDisk(centerHex, 2); // Get center + 2 rings

	// 	logger.info(`Generated ${hexagons.length} hexagons for ${cityName}`);
	// 	return hexagons;
	// }

	/**
	 * Get all test cities hexagons (for POC testing)
	 * @returns {Array} Array of H3 indexes for all test cities
	 */
	// getAllTestCitiesHexagons() {
	// 	const allHexagons = new Set();

	// 	nigeriaConfig.testCities.forEach((city) => {
	// 		const centerHex = h3.latLngToCell(
	// 			city.lat,
	// 			city.lng,
	// 			this.resolution,
	// 		);
	// 		const hexagons = h3.gridDisk(centerHex, 1);
	// 		hexagons.forEach((hex) => allHexagons.add(hex));
	// 	});

	// 	const hexArray = Array.from(allHexagons);
	// 	logger.info(
	// 		`Generated ${hexArray.length} hexagons for all test cities`,
	// 	);

	// 	return hexArray;
	// }

	calculateBoundingBox(geojson: any) {
		if (!geojson || !geojson.features || geojson.features.length === 0) {
			return null;
		}

		let minLat = Infinity,
			maxLat = -Infinity;
		let minLng = Infinity,
			maxLng = -Infinity;

		function processCoordinates(coords: any) {
			if (typeof coords[0] === 'number') {
				// It's a single coordinate [lng, lat]
				const [lng, lat] = coords;
				minLat = Math.min(minLat, lat);
				maxLat = Math.max(maxLat, lat);
				minLng = Math.min(minLng, lng);
				maxLng = Math.max(maxLng, lng);
			} else {
				// It's an array of coordinates
				coords.forEach(processCoordinates);
			}
		}

		geojson.features.forEach((feature: any) => {
			if (feature.geometry && feature.geometry.coordinates) {
				processCoordinates(feature.geometry.coordinates);
			}
		});

		return {
			north: maxLat,
			south: minLat,
			east: maxLng,
			west: minLng,
		};
	}

	/**
	 * Save results to file
	 * @param results - Results to save
	 */
	private async saveResults(results: {
    data: any[];
    metadata: {
        collectionDate: string;
        hexagonResolution: number;
        totalHexagons: number;
        totalResults: number;
        runtime: string;
    };
}): Promise<void> {
		// save in firestore , collection name 'saloons'
        const collectionName = 'saloons';
        const batch = database.batch();
        results.data.forEach((place: any) => {
          const docRef = database.collection(collectionName).doc(place.placeId);
          batch.set(docRef, place);
        });
        await batch.commit();
        logger.info(`Saved ${results.data.length} places to Firestore collection '${collectionName}'`);
	}

	/**
	 * Generate Nigeria hexagons
	 * @returns Array of hexagon IDs
	 */
	generateNigeriaHexagons(){
    logger.info(`Generating H3 hexagons at resolution ${this.resolution} for Nigeria`);
    
    const { boundaries, geojson } = nigeriaConfig;
    const hexagons = new Set<string>();

    if (geojson) {
      logger.info('Using GeoJSON for precise boundary detection');
      // Use GeoJSON coordinates to generate hexagons
      this.extractHexagonsFromGeoJSON(geojson, hexagons);
    } else {
      logger.fatal('No GeoJSON found, using grid-based approach with boundaries');
      // Fallback to grid-based approach
      const latStep = (boundaries.north - boundaries.south) / 20;
      const lngStep = (boundaries.east - boundaries.west) / 20;

      for (let lat = boundaries.south; lat <= boundaries.north; lat += latStep) {
        for (let lng = boundaries.west; lng <= boundaries.east; lng += lngStep) {
          const h3Index = h3.latLngToCell(lat, lng, this.resolution);
          hexagons.add(h3Index);
        }
      }
    }

    // Get all hexagons in the ring around each hexagon to ensure full coverage
    const allHexagons = new Set(hexagons);
    for (const hex of hexagons) {
      const neighbors = h3.gridDisk(hex, 1);
      neighbors.forEach(neighbor => allHexagons.add(neighbor));
    }

    const hexArray = Array.from(allHexagons);
    logger.info(`Generated ${hexArray.length} hexagons covering Nigeria`);
    
    return hexArray;
  }
	/**
	 * Get all test cities hexagons
	 * @returns Array of hexagon IDs
	 */
	getAllTestCitiesHexagons(): string[] {
		// Implementation for getting test cities hexagons
		return [];
	}
}
