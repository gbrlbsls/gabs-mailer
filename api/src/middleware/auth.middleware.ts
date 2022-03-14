import { NextFunction, Request, Response } from "express";
import config from "../../config.json";

const masterToken = config.app.master_token;

export function authenticateWithMasterToken(req: Request, res: Response, next: NextFunction) {
	const { headers } = req;

	const authToken: string = (headers.authorization || '').replace("Bearer ", "").trim();

	if (authToken == masterToken) {
		return next();
	}

	return res.status(401).json("Unauthorized").send();
}