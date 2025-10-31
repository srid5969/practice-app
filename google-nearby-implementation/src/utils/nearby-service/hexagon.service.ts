import { env } from '../../environment';
import logger from '../../lib/logger';
import { HEXAGON_RESOLUTION, locationConfig } from '../constants';

const h3 = require('h3-js');

/**
 * Service for handling H3 hexagon operations
 */
export class HexagonService {
	private resolution: number;
	constructor(resolution = HEXAGON_RESOLUTION) {
		this.resolution = HEXAGON_RESOLUTION;
	}

	/**
	 * Generate H3 hexagons covering Nigeria
	 * @returns {Array} Array of H3 indexes
	 */
	generateHexagons() {
		logger.info(
			`Generating H3 hexagons at resolution ${this.resolution} for Nigeria`,
		);

		const locations = locationConfig;
		const allHexagons = new Set();

		for (const location of locations) {
			const { boundaries, geojson } = location;
			const hexagons = new Set();

			if (geojson) {
				logger.info('Using GeoJSON for precise boundary detection');
				// Use GeoJSON coordinates to generate hexagons
				this.extractHexagonsFromGeoJSON(geojson, hexagons);
			} else {
				logger.info(
					'No GeoJSON found, using grid-based approach with boundaries',
				);
				// Fallback to grid-based approach
				const latStep = (boundaries.north - boundaries.south) / 20;
				const lngStep = (boundaries.east - boundaries.west) / 20;

				for (
					let lat = boundaries.south;
					lat <= boundaries.north;
					lat += latStep
				) {
					for (
						let lng = boundaries.west;
						lng <= boundaries.east;
						lng += lngStep
					) {
						const h3Index = h3.latLngToCell(
							lat,
							lng,
							this.resolution,
						);
						hexagons.add(h3Index);
					}
				}
			}

			// Get all hexagons in the ring around each hexagon to ensure full coverage
			const allHexagons = new Set(hexagons);
			for (const hex of hexagons) {
				const neighbors = h3.gridDisk(hex, 1);
				neighbors.forEach((neighbor) => allHexagons.add(neighbor));
			}
		}

		const hexArray = Array.from(allHexagons);
		logger.info(`Generated ${hexArray.length} hexagons covering Nigeria`);

		return hexArray;
	}

	/**
	 * Extract hexagons from GeoJSON coordinates
	 * @param {Object} geojson - GeoJSON object
	 * @param {Set} hexagons - Set to add hexagons to
	 */
	extractHexagonsFromGeoJSON(geojson, hexagons) {
		const processCoordinates = (coords) => {
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

		geojson.features.forEach((feature) => {
			if (feature.geometry && feature.geometry.coordinates) {
				processCoordinates(feature.geometry.coordinates);
			}
		});
	}

	/**
	 * Get center coordinates of a hexagon
	 * @param {string} h3Index - H3 index
	 * @returns {Object} {lat, lng}
	 */
	getHexagonCenter(h3Index) {
		const [lat, lng] = h3.cellToLatLng(h3Index);
		return { lat, lng };
	}

	/**
	 * Get boundary coordinates of a hexagon
	 * @param {string} h3Index - H3 index
	 * @returns {Array} Array of [lat, lng] coordinates
	 */
	getHexagonBoundary(h3Index) {
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

	calculateBoundingBox(geojson) {
		if (!geojson || !geojson.features || geojson.features.length === 0) {
			return null;
		}

		let minLat = Infinity,
			maxLat = -Infinity;
		let minLng = Infinity,
			maxLng = -Infinity;

		function processCoordinates(coords) {
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

		geojson.features.forEach((feature) => {
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

	static calculateDistance(lat1, lng1, lat2, lng2) {
		const toRadians = (degrees) => (degrees * Math.PI) / 180;

		const R = 6371e3; // Earth's radius in meters
		const φ1 = toRadians(lat1);
		const φ2 = toRadians(lat2);
		const Δφ = toRadians(lat2 - lat1);
		const Δλ = toRadians(lng2 - lng1);

		const a =
			Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
			Math.cos(φ1) *
				Math.cos(φ2) *
				Math.sin(Δλ / 2) *
				Math.sin(Δλ / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		const distance = R * c; // in meters
		return distance;
	}
}

