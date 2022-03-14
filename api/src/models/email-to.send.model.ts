export interface EmailToSend {
	subject: string;
	body?: string;
	to: string;
	cc?: string;
}