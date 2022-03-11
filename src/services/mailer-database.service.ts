import appConfig from "../../config.json";
import { PoolConnection } from "mysql2/promise";
import { databaseService } from './database.service';
import { EmailToSend } from '../models/email-to-send.model';
import { EmailStatus } from "../models/email-status.model";

const tableName = appConfig.mailer.database.table;
const tableColumns = appConfig.mailer.database.columns;

export class MailerDatabaseService {

	private databaseConnection: PoolConnection;

	constructor(databaseConnection: PoolConnection) {
		this.databaseConnection = databaseConnection;
	}

	async testConnection(): Promise<void> {
		await this.databaseConnection.execute("SELECT version();");
	}

	async getEmailsToSend(): Promise<EmailToSend[]> {		
		const result = await this.databaseConnection.execute(`SELECT ${tableColumns.id} as id, ${tableColumns.body} as body, ${tableColumns.email_to} as email_to, ${tableColumns.emails_cc} as emails_cc, ${tableColumns.subject} as subject FROM ${tableName} WHERE ${tableColumns.status} = ${EmailStatus.TOSENT};`);

		return (result[0] as unknown) as EmailToSend[];
	}
	
	async getEmailStatus(id: number): Promise<EmailStatus | null> {
		const result = await this.databaseConnection.execute(`SELECT ${tableColumns.status} as id FROM ${tableName} WHERE ${tableColumns.id} = ${id};`);

		const [items] = result as any[];

		if (items.length < 1)
			return null;

		return items[0];
	}

	async markEmailAs(id: number, status: EmailStatus) {		
		await this.databaseConnection.execute(`UPDATE ${tableName} SET ${tableColumns.status}=${status} WHERE ${tableColumns.id}=${id};`);
		return true;
	}

}