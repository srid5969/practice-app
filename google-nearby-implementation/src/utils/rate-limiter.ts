const pLimit = require('p-limit').default;

/**
 * Rate Limiter for Google Places API
 * Ensures we don't exceed 10 requests per second
 */
export class RateLimiter {
	private requestsPerSecond: number;
	private intervalMs: number;
	private lastRequestTime: number;
	private limit: any;
	private stats: {
		totalRequests: number;
		successfulRequests: number;
		failedRequests: number;
		startTime: number;
	};

	constructor(requestsPerSecond = 10, maxConcurrent = 5) {
		this.requestsPerSecond = requestsPerSecond;
		this.intervalMs = 1000 / requestsPerSecond; // Time between requests in ms
		this.lastRequestTime = 0;
		this.limit = pLimit(maxConcurrent);

		this.stats = {
			totalRequests: 0,
			successfulRequests: 0,
			failedRequests: 0,
			startTime: Date.now(),
		};
	}

	/**
	 * Execute a function with rate limiting
	 * @param {Function} fn - The function to execute
	 * @returns {Promise} - Result of the function
	 */
	async execute(fn) {
		return this.limit(async () => {
			await this.waitIfNeeded();
			this.stats.totalRequests++;

			try {
				const result = await fn();
				this.stats.successfulRequests++;
				return result;
			} catch (error) {
				this.stats.failedRequests++;
				throw error;
			}
		});
	}

	/**
	 * Wait if needed to maintain rate limit
	 */
	async waitIfNeeded() {
		const now = Date.now();
		const timeSinceLastRequest = now - this.lastRequestTime;

		if (timeSinceLastRequest < this.intervalMs) {
			const waitTime = this.intervalMs - timeSinceLastRequest;
			await this.sleep(waitTime);
		}

		this.lastRequestTime = Date.now();
	}

	/**
	 * Sleep for specified milliseconds
	 * @param {number} ms - Milliseconds to sleep
	 */
	sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Get current statistics
	 */
	getStats() {
		const runtime = (Date.now() - this.stats.startTime) / 1000;
		return {
			...this.stats,
			runtime: runtime.toFixed(2) + ' seconds',
			requestsPerSecond: (this.stats.totalRequests / runtime).toFixed(2),
		};
	}

	/**
	 * Reset statistics
	 */
	resetStats() {
		this.stats = {
			totalRequests: 0,
			successfulRequests: 0,
			failedRequests: 0,
			startTime: Date.now(),
		};
	}
}
