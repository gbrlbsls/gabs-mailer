import { DatabaseConnection } from "../data/database.context";
import { EmailToSend } from "../models/email-to.send.model";
import config from "../../config.json";
import { EmailStatus } from "../models/email-status.model";

const tableName = config.mailer.database.table;
const columns = config.mailer.database.columns;

export class EmailRepository {

	private databaseConnection: DatabaseConnection;

	constructor(databaseConnection: DatabaseConnection) {
		this.databaseConnection = databaseConnection;
	}

	async insertEmailToSend(emailToSend: EmailToSend): Promise<void> {
		const query = `INSERT INTO ${tableName} (${columns.subject}, ${columns.body}, ${columns.email_to}, ${columns.emails_cc}, ${columns.status}) 
		VALUES (?, ?, ?, ?, ?);`
		this.databaseConnection.execute(query, [emailToSend.subject, emailToSend.body, emailToSend.to, emailToSend.cc, EmailStatus.TOSENT])
	}
}