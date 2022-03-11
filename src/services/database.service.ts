import appConfig from '../../config.json';
import mysql from "mysql2";
import { PoolConnection } from "mysql2/promise";

class DatabaseService {

	private pool: mysql.Pool;
	constructor() {
		this.pool = mysql.createPool({
			...appConfig.mysql,

			insecureAuth: true,
			waitForConnections: true,
			connectionLimit: 10,
			queueLimit: 0
		});

	}

	async getConnection() : Promise<PoolConnection> {
		return await this.pool.promise().getConnection();
	}
}

export const databaseService = new DatabaseService();