import { DotenvParseOutput, config as configDotenv } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { Dialect } from 'sequelize';
import IEnvironment from './interface';

class Environment implements IEnvironment {
	port: number;
	dbUser: string;
	dbPassword: string;
	dbDatabase: string;
	dbIp: string;
	dbPort: number;
	dbDialect?: Dialect;
	applicationName: string;

	public parsedEnv: DotenvParseOutput;

	constructor() {
		this.setEnvironment();
		
		const port: string | undefined | number = this.parsedEnv.PORT || 8080;
		this.port = Number(port);
		this.applicationName = this.parsedEnv.APPLICATION_NAME;
		this.dbUser = this.parsedEnv.DB_USER;
		this.dbPassword = this.parsedEnv.DB_PASSWORD;
		this.dbDatabase = this.parsedEnv.DB_DATABSE;
		this.dbIp = this.parsedEnv.DB_IP;
		this.dbPort = parseInt(this.parsedEnv.DB_PORT || '5432', 10);
		console.debug('ENV | Environment variables set successfully');
	}

	public setEnvironment(): void {
		// console.debug('ENV | Setting environment variables');
		// const rootdir: string = path.resolve(__dirname, '../../');
		// const envPath = path.resolve(rootdir, '.env');
		// console.debug(`ENV | Root directory resolved at ${rootdir}`);
		// if (!fs.existsSync(envPath)) {
		// 	console.error('ENV | .env file is missing in root directory');
		// 	throw new Error('.env file is missing in root directory');
		// }
		// console.debug(`ENV | .env file found at ${envPath}, loading...`);
		// const envConfig = configDotenv({ path: envPath });
		// console.debug('ENV | .env file found, loading variables', this.parsedEnv);
		// const { parsed: parsedConfig } = configDotenv({ path: envPath });
		
		configDotenv();
		this.parsedEnv = process.env;
		if(!this.parsedEnv) {
			console.error('ENV configuration not found')
			throw new Error('ENV variable not found')
		}
		console.debug("Found ENV variables are  ", this.parsedEnv)

	}
}

export default Environment;
const env = new Environment();
export { env };