export interface MailerResponse<T = any> {
	data?: T;
	message?: string;
	ok: boolean;
}