import { Dialect } from 'sequelize';

interface IEnvironment {
	port: number;
	dbUser: string;
	dbPassword: string;
	dbDatabase: string;
	dbIp: string;
	dbPort: number;
	dbDialect?: Dialect;
	applicationName: string;
	setEnvironment(env: string): void;
}

export default IEnvironment;
