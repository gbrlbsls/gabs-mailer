export interface EmailToSend {
	id: number;
	subject: string;
	body?: string;
	email_to: string;
	emails_cc?: string;
}