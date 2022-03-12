import appConfig from '../../config.json';
import mariadb, { PoolConnection } from "mariadb";

class DatabaseService {

	private pool: mariadb.Pool;
	constructor() {
		this.pool = mariadb.createPool({
			...appConfig.database,
			connectionLimit: 10,
		});

	}

	async getConnection() : Promise<PoolConnection> {
		
		return await this.pool.getConnection();
	}
}

export const databaseService = new DatabaseService();