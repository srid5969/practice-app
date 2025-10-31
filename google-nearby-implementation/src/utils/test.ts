// const fs = require('fs').promises;
// const path = require('path');
// const HexagonService = require('../services/hexagon.service');
// const PlacesService = require('../services/places.service');
// const RateLimiter = require('../utils/rate-limiter');
// const Logger = require('../utils/logger');
// const mapsConfig = require('../config/maps.config');

import fs from 'fs/promises';
import path from 'path';
import { HexagonService } from '../services/hexagon.service';
import { PlacesService } from '../services/places.service';
import { RateLimiter } from '../utils/rate-limiter';

class CollectorWorker {
	constructor() {
		this.hexagonService = new HexagonService(mapsConfig.h3.resolution);
		this.placesService = new PlacesService();
		this.rateLimiter = new RateLimiter(
			mapsConfig.rateLimit.requestsPerSecond,
			mapsConfig.rateLimit.maxConcurrentRequests,
		);
		this.resultsDir = process.env.RESULTS_DIR || './backend/data/results';
		this.isRunning = false;
		this.currentProgress = {
			totalHexagons: 0,
			processedHexagons: 0,
			totalResults: 0,
			startTime: null,
			status: 'idle',
		};
	}

	/**
	 * Start collection process
	 * @param {Object} options - Collection options
	 * @returns {Promise<Object>} Collection results
	 */
	async startCollection(options = {}) {
		if (this.isRunning) {
			throw new Error('Collection is already running');
		}

		this.isRunning = true;
		this.currentProgress.status = 'running';
		this.currentProgress.startTime = Date.now();

		try {
			Logger.info('Starting salon data collection');

			// Generate hexagons based on scope
			const hexagons = options.testMode
				? this.hexagonService.getAllTestCitiesHexagons()
				: this.hexagonService.generateHexagons();

			this.currentProgress.totalHexagons = hexagons.length;

			const allResults = [];
			const seenPlaceIds = new Set();

			// Process each hexagon
			for (let i = 0; i < hexagons.length; i++) {
				const hexagon = hexagons[i];
				Logger.info(
					`Processing hexagon ${i + 1}/${hexagons.length}: ${hexagon}`,
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

				allResults.push(...uniqueResults);

				this.currentProgress.processedHexagons = i + 1;
				this.currentProgress.totalResults = allResults.length;

				Logger.success(
					`Hexagon ${i + 1} processed: ${uniqueResults.length} unique results`,
				);

				// Stop if in test mode and we have enough results
				if (options.testMode && allResults.length > 50) {
					Logger.info('Test mode: Stopping after 50 results');
					break;
				}
			}

			// Save results to JSON file
			const results = {
				collectionDate: new Date().toISOString(),
				hexagonResolution: mapsConfig.h3.resolution,
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

			await this.saveResults(results);

			this.currentProgress.status = 'completed';
			this.isRunning = false;

			Logger.success('Collection completed successfully', {
				totalPlaces: allResults.length,
				runtime: results.metadata.runtime,
			});

			return results;
		} catch (error) {
			Logger.error('Error in collection process', error);
			this.currentProgress.status = 'error';
			this.isRunning = false;
			throw error;
		}
	}

	/**
	 * Save results to JSON file
	 * @param {Object} results - Results to save
	 */
	async saveResults(results) {
		try {
			// Ensure results directory exists
			await fs.mkdir(this.resultsDir, { recursive: true });

			const filename = `salons_${Date.now()}.json`;
			const filepath = path.join(this.resultsDir, filename);

			await fs.writeFile(filepath, JSON.stringify(results, null, 2));

			Logger.success(`Results saved to ${filepath}`);
		} catch (error) {
			Logger.error('Error saving results', error);
			throw error;
		}
	}

	/**
	 * Get current progress
	 * @returns {Object} Current progress
	 */
	getProgress() {
		return {
			...this.currentProgress,
			percentage:
				this.currentProgress.totalHexagons > 0
					? (
							(this.currentProgress.processedHexagons /
								this.currentProgress.totalHexagons) *
							100
						).toFixed(2)
					: 0,
		};
	}

	/**
	 * Get all saved results files
	 * @returns {Promise<Array>} List of result files
	 */
	async getResultFiles() {
		try {
			const files = await fs.readdir(this.resultsDir);
			const jsonFiles = files.filter((f) => f.endsWith('.json'));

			return jsonFiles.map((filename) => ({
				filename,
				filepath: path.join(this.resultsDir, filename),
			}));
		} catch (error) {
			Logger.error('Error reading result files', error);
			return [];
		}
	}

	/**
	 * Load results from a specific file
	 * @param {string} filename - Filename to load
	 * @returns {Promise<Object>} Results data
	 */
	async loadResults(filename) {
		try {
			const filepath = path.join(this.resultsDir, filename);
			const data = await fs.readFile(filepath, 'utf8');
			return JSON.parse(data);
		} catch (error) {
			Logger.error('Error loading results', error);
			throw error;
		}
	}
}
