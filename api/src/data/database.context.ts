import config from "../../config.json";
import mariadb, { PoolConnection } from "mariadb";

class DatabaseContext {

	private pool: mariadb.Pool;
	constructor() {
		this.pool = mariadb.createPool({
			...config.database,
			connectionLimit: 10,
		});

	}

	async getConnection() : Promise<PoolConnection> {
		
		return await this.pool.getConnection();
	}
}

export type DatabaseConnection = PoolConnection;
export const databaseContext = new DatabaseContext();