import { EmailToSend } from "../models/email-to.send.model";
import { Router,Request,Response } from "express";
import { databaseContext } from "../data/database.context";
import { EmailRepository } from "../repositories/email.repository";
import { EmailService } from "../services/email.service";
import { AppError } from '../models/app.error';

export const emailController = Router();

emailController.post("/", async (req: Request<{body: EmailToSend}>, res: Response) => {
	try {
		const emailToSend: EmailToSend = req.body;
		const databaseConnection = await databaseContext.getConnection();
		const emailRepository = new EmailRepository(databaseConnection);
		const emailService = new EmailService(emailRepository);

		await emailService.insertEmailToSend(emailToSend);

		res.json("OK").send();
	} catch (e) {

		if (!(e instanceof AppError)) {
			console.error(e);
			return res.json("Something gone wrong...").status(500).send();
		}
		
		res.json(e.message).status(400).send();
	}
});