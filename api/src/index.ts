import express, { json } from "express";
import config from "../config.json";
import { emailController } from "./controllers/email.controller";
import { authenticateWithMasterToken } from "./middleware/auth.middleware";

const app = express();

app.use(authenticateWithMasterToken);
app.use(json())
app.use("/email", emailController);

app.listen(config.app.port, () => {
	console.log(`Server running on port ${config.app.port}`);
});