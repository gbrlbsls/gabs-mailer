import { AppError } from "../models/app.error";
import { EmailToSend } from "../models/email-to.send.model";
import { EmailRepository } from "../repositories/email.repository";
import { validateEmail } from "../utils/common";

export class EmailService {

	private emailRepository: EmailRepository;

	constructor(emailRepository: EmailRepository) {
		this.emailRepository = emailRepository;
	}

	public async insertEmailToSend(emailToSend: EmailToSend): Promise<void> {

		emailToSend = emailToSend ?? {};

		let {subject, body, to, cc} = emailToSend;
		
		subject = subject ?? "";
		body = body ?? "";
		to = to ?? "";
		cc = cc ?? "";

		if (subject == "")
			throw new AppError("Invalid 'subject'")
		
		if (body == "")
			throw new AppError("Invalid 'body'")
		
		if (to == "" || !validateEmail(to))
			throw new AppError(`Invalid 'to': "${to}"`)
		
		if (cc != "") {
			const ccs = cc.split(",");
			for (let email of ccs) {
				if (!validateEmail(email))
					throw new AppError(`Invalid email in 'cc': ${email}`);
			}
		}

		await this.emailRepository.insertEmailToSend(emailToSend);
	}
}