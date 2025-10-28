import express, { Application, NextFunction, Request, Response } from 'express';
import { Server as HttpServer } from 'http';
import { env } from './environment';

class App {
	public express: Application;
	public httpServer: HttpServer;

	public async init() {
		this.express = express();
		this.httpServer = new HttpServer(this.express);
		this.preAuthRoutes();
		// this.unhandlerRoute();
		await this.loggerWatcher();
	}

	private healthRoute(req: Request, res: Response, next: NextFunction) {
		const healthcheck = {
			uptime: process.uptime(),
			message: 'Server is healthy and running',
			timestamp: Date.now(),
		};
		try {
			res.send(healthcheck);
		} catch (e) {
			healthcheck.message = e;

			res.status(503).send(healthcheck);
		}
	}
	private unhandlerRoute(): void {
		this.express.all('*', function (req, res, next) {
			res.status(404).json({
				status: 'fail',
				message: `Can't find ${req.originalUrl} on this server!!!`,
			});
		});
	}

	private async loggerWatcher() {
		console.log(`APP | watcher running app`);
	}

	private preAuthRoutes(): void {
		this.express.get('/health', this.healthRoute);
	}
}

export default App;
