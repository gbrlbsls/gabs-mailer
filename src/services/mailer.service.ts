import { EmailStatus } from "../models/email-status.model";
import { EmailToSend } from "../models/email-to-send.model";
import appConfig from "../../config.json";
import { EmailService } from "./email.service";
import { MailerDatabaseService } from "./mailer-database.service";
import { databaseService } from "./database.service";
import { PoolConnection } from "mariadb";

export class MailerService {

	private databaseConnection: PoolConnection;
	private emailService: EmailService;
	private mailerDatabaseService: MailerDatabaseService;

	constructor(databaseConnection: PoolConnection, emailService: EmailService, mailerDatabaseService: MailerDatabaseService) {
		this.databaseConnection = databaseConnection;
		this.emailService = emailService;
		this.mailerDatabaseService = mailerDatabaseService;
	}

	async sendEmailsAndUpdateStatus(emailsToSend: EmailToSend[]): Promise<Map<number, EmailStatus>> {
		const results: Map<number, EmailStatus> = new Map<number, EmailStatus>();

		const transporter = this.emailService.getTransporter();
		
		for (let email of emailsToSend) {
			const emailStatus = await this.mailerDatabaseService.getEmailStatus(email.id);
			if (emailStatus === null || emailStatus > 0)
				continue;

			await this.mailerDatabaseService.markEmailAs(email.id, EmailStatus.SENTING);
			let nextStatus = EmailStatus.SENT;
			try {
				const sent = await this.emailService.sendEmail({
					from: appConfig.email.smtp.user,
					subject: email.subject ?? "Abra e veja",
					html: email.body,
					to: email.email_to ?? "",
					cc: email.emails_cc ?? ""
				}, transporter);
				if (!sent)
					throw new Error("Email não enviado");
			} catch (e) {
				console.error(e);
				nextStatus = EmailStatus.TOSENT;
			}

			results.set(email.id, nextStatus);
			await this.mailerDatabaseService.markEmailAs(email.id, nextStatus);
		}

		return results;
	}
}