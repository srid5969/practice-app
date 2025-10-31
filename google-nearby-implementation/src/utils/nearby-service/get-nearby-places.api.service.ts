import {
	Client,
	PlacesNearbyRequest,
} from '@googlemaps/google-maps-services-js';
import { env } from '../../environment';
import logger from '../../lib/logger';
import { searchKeywords } from '../constants';
import { response } from 'express';
interface GeoLocationResponse {
	business_status: string;
	geometry: {
		location: {
			lat: number;
			lng: number;
		};
		viewport: {
			northeast: {
				lat: number;
				lng: number;
			};
			southwest: {
				lat: number;
				lng: number;
			};
		};
	};
	icon: string;
	icon_background_color: string;
	icon_mask_base_uri: string;
	international_phone_number?: string;
	name: string;
	opening_hours: {
		open_now: boolean;
	};
	photos?: Array<{
		height: number;
		html_attributions: Array<string>;
		photo_reference: string;
		width: number;
	}>;
	place_id: string;
	rating?: number;
	reference: string;
	scope: string;
	types: Array<string>;
	user_ratings_total?: number;
	vicinity: string;
	plus_code?: {
		compound_code: string;
		global_code: string;
	};
}
export class PlacesService {
	private client: Client;
	private apiKey: string;
	constructor() {
		this.client = new Client({});
		this.apiKey = env.googleApiKey;
	}

	async nearbySearch(location, radius = 50000, pageToken = null) {
		try {
			const placesNearbyRequest: PlacesNearbyRequest = {
				params: {
					key: this.apiKey,
					location: `${location.lat},${location.lng}`,
					radius: radius,
					keyword: searchKeywords.join(' '),
				},
			};

			if (pageToken) {
				placesNearbyRequest.params.pagetoken = pageToken;
				// Remove other parameters when using pagetoken
				delete placesNearbyRequest.params.location;
				delete placesNearbyRequest.params.radius;
				delete placesNearbyRequest.params.keyword;
			}

			logger.info('Making Places API request', {
				location: placesNearbyRequest.params.location,
				hasPageToken: !!pageToken,
			});

			const response =
				await this.client.placesNearby(placesNearbyRequest);

			if (
				response.data.status === 'OK' ||
				response.data.status === 'ZERO_RESULTS'
			) {
				return {
					results:
						response.data.results || ([] as GeoLocationResponse[]),
					nextPageToken: response.data.next_page_token || null,
					status: response.data.status,
				};
			} else {
				logger.error('Places API error', {
					status: response.data.status,
					error_message: response.data.error_message,
				});
				throw new Error(`Places API error: ${response.data.status}`);
			}
		} catch (error) {
			logger.error('Error in nearbySearch', error);
			throw error;
		}
	}

	/**
	 * Get all results for a location (handles pagination)
	 * @param {Object} location - {lat, lng}
	 * @param {number} radius - Search radius in meters
	 * @returns {Promise<Array>} All results
	 */
	async getAllResults(location, radius = 5000) {
		let allResults: GeoLocationResponse[] = [];
		let pageToken = null;
		let pageCount = 0;
		const maxPages = 100; // Google Places API returns max 100 pages (6000 results)

		do {
			// Wait 2 seconds before requesting next page (Google requirement)
			if (pageToken) {
				logger.info('Waiting 2 seconds before fetching next page...');
				await this.sleep(2000);
			}

			const response = await this.nearbySearch(
				location,
				radius,
				pageToken,
			);
			logger.info(`Fetched ${response.results.length} results for page ${pageCount + 1}`,response);

			if (response.results.length > 0) {
				allResults = allResults.concat(
					response.results as GeoLocationResponse[],
				);
				logger.info(
					`Fetched page ${pageCount + 1}: ${response.results.length} results`,
				);
			}

			pageToken = response.nextPageToken;
			pageCount++;

			// Break if no more pages or reached max pages
			if (!pageToken || pageCount >= maxPages) {
				break;
			}
		} while (pageToken);

		logger.info(`Total results for location: ${allResults.length}`, {
			latitude: location.lat,
			longitude: location.lng,
			radius: radius,
		});
		return allResults;
	}

	/**
	 * Transform Places API result to simplified format
	 * @param {Object} place - Places API result
	 * @returns {Object} Transformed place data
	 */
	transformPlace(place) {
		return {
			placeId: place.place_id,
			name: place.name,
			address: place.vicinity || place.formatted_address,
			location: {
				lat: place.geometry.location.lat,
				lng: place.geometry.location.lng,
			},
			types: place.types,
			businessStatus: place.business_status,
			rating: place.rating || null,
			userRatingsTotal: place.user_ratings_total || 0,
			icon: place.icon,
			photos: place.photos
				? place.photos.map((p) => p.photo_reference)
				: [],
		};
	}

	/**
	 * Sleep utility
	 * @param {number} ms - Milliseconds to sleep
	 */
	sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

export const placesService = new PlacesService();
