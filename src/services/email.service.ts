import appConfig from "../../config.json";
import nodemailer, {Transporter} from 'nodemailer';
import Mail from "nodemailer/lib/mailer";
import { PoolConnection } from "mysql2/promise";

export class EmailService {

	getTransporter(): Transporter {
		let transporter: Transporter = nodemailer.createTransport({
			host: appConfig.email.smtp.host,
			port: appConfig.email.smtp.port,
			secure: false,
			auth: {
				user: appConfig.email.smtp.user,
				pass: appConfig.email.smtp.password,
			},
		});

		return transporter;
	}

	async sendEmail(mailPayload: Mail.Options, transporter?: Transporter): Promise<boolean> {
		let _transporter: Transporter;
		if (transporter == undefined)
			_transporter = this.getTransporter();
		else
			_transporter = transporter;
		
		let error, info = await _transporter.sendMail(mailPayload);
		
		return info.rejected.length == 0;
	}
}