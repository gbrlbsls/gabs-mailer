import cron from "node-cron";
import appConfig from "../config.json";
import { Application } from "./application/application";
import { EmailStatus } from "./models/email-status.model";
import { databaseService } from "./services/database.service";
import { MailerDatabaseService } from "./services/mailer-database.service";

testConnection().then(() => {
	console.info("Programa rodando!");
	cron.schedule(appConfig.mailer.interval, doThings, {timezone: appConfig.mailer.timezone});
});

async function testConnection() {
	console.info("Conectando ao banco de dados...");
	const databaseConnection = await databaseService.getConnection();
	const mailerDatabaseService = new MailerDatabaseService(databaseConnection);

	try {
		await mailerDatabaseService.testConnection();
	} catch(e) {
		console.error(e);
		process.exit(1);
	}

}

async function doThings() {
	const databaseConnection = await databaseService.getConnection();
	const application = new Application(databaseConnection);

	console.info("Procurando emails para enviar {");
	const emailsToSendResponse = await application.getEmailsToSend();

	if (!emailsToSendResponse.ok) {
		console.error(emailsToSendResponse.message);
		console.info("}");
		databaseConnection.release();
		return;
	}

	const emailsToSend = emailsToSendResponse.data;

	if (emailsToSend === undefined || emailsToSend.length < 1) {
		console.info("Nenhum email encontrado.");
		console.info("}");
		databaseConnection.release();
		return;
	}

	console.info(`${emailsToSend.length} emails encontrados.`);

	console.info(`Enviando emails`);
	const sendEmailsAndUpdateStatusResponse = await application.sendEmailsAndUpdateStatus(emailsToSend!);
	if (!sendEmailsAndUpdateStatusResponse.ok) {
		console.error(sendEmailsAndUpdateStatusResponse.message);
		console.info("}");
		databaseConnection.release();
		return;
	}

	const emailsSent = sendEmailsAndUpdateStatusResponse.data!;

	let successfullEmailsSentCount = 0;
	let failedEmailsSent: number[] = [];
	for (let [emailId, emailStatus] of emailsSent) {
		if (emailStatus != EmailStatus.SENT) {
			failedEmailsSent.push(emailId);
			continue;
		}
		
		successfullEmailsSentCount += 1;
	}

	console.info(`${successfullEmailsSentCount} de ${emailsToSend.length} emails enviado(s)`);
	console.warn(`Os seguinte emails não foram enviados(id banco de dados): [${failedEmailsSent.join(", ")}]`);
	console.info("}");
}
