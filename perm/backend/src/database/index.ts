import { Sequelize } from 'sequelize';
import logger from '../lib/logger';
import { env } from '../environment';

class Database {
	private static connectionInstance: Sequelize | null = null;

	private static establishConnection(): void {
		logger.info('DB Connection has been established - ', env.dbIp);
		this.connectionInstance = new Sequelize(
			env.dbDatabase || '',
			env.dbUser || '',
			env.dbPassword || '',
			{
				host: env.dbIp || 'localhost',
				port: env.dbPort || 5432,
				dialect: 'postgres' as const,
				dialectOptions: {
					useUTC: true,
				},
				timezone: '+00:00',
				logging: console.log,
			},
		);
	}

	public static getConnection(): Sequelize {
		this.establishConnection();
		if (!this.connectionInstance) {
			throw new Error('Database connection not established.');
		}
		return this.connectionInstance;
	}

	public static async testConnection(): Promise<void> {
		try {
			await this.getConnection().authenticate();
			console.log('Connection has been established successfully.');
		} catch (error) {
			console.error('Unable to connect to the database:', error);
		}
	}

	public static async closeConnection(): Promise<void> {
		if (this.connectionInstance) {
			try {
				await this.connectionInstance.close();
				console.log('Database connection closed.');
			} catch (err) {
				console.error('Error closing database connection:', err);
			}
		}
	}

	public static async syncDatabaseSchema(force = true) {
		logger.trace(
			'Forcefully syncing database schema , this will erase the data in the schema',
		);
		await this.getConnection().sync({ force });
		logger.info('Data synchronization completed');
	}
}
export { Database };
