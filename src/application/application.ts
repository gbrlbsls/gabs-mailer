import { PoolConnection } from "mysql2/promise";
import { EmailStatus } from "../models/email-status.model";
import { EmailToSend } from "../models/email-to-send.model";
import { MailerResponse } from "../models/mailer-response.model";
import { EmailService } from "../services/email.service";
import { MailerDatabaseService } from "../services/mailer-database.service";
import { MailerService } from "../services/mailer.service";

export class Application {

	private databaseConnection: PoolConnection;
	private mailerDatabaseService: MailerDatabaseService;
	private emailService: EmailService;
	private mailerService: MailerService;

	constructor(databaseConnection: PoolConnection) {
		this.databaseConnection = databaseConnection;
		this.mailerDatabaseService = new MailerDatabaseService(databaseConnection);
		this.emailService = new EmailService();
		this.mailerService = new MailerService(databaseConnection, this.emailService, this.mailerDatabaseService);
	}

	async getEmailsToSend(): Promise<MailerResponse<EmailToSend[]>> {
		const response: MailerResponse<EmailToSend[]> = {
			data: [],
			ok: false
		}

		try {
			response.data = await this.mailerDatabaseService.getEmailsToSend();
			response.ok = true;
		} catch (e: any) {
			response.message = e.message;
		}

		return response;
	}

	async sendEmailsAndUpdateStatus(emailsToSend: EmailToSend[]): Promise<MailerResponse<Map<number, EmailStatus>>> {
		const response: MailerResponse<Map<number, EmailStatus>> = {
			ok: false
		}

		try {
			const results = await this.mailerService.sendEmailsAndUpdateStatus(emailsToSend);
			response.data = results;
			response.ok = true;
		} catch (e: any) {
			response.message = e.message;
		}

		return response;
	}

}