USE gabs_mailer;
CREATE TABLE sent_emails (
	id INT auto_increment NOT NULL,
	subject varchar(256) DEFAULT '' NOT NULL,
	body TEXT NOT NULL,
	email_to varchar(256) DEFAULT '' NOT NULL,
	emails_cc TEXT NOT NULL,
	status INT DEFAULT 0 NOT NULL,
	CONSTRAINT sent_emails_PK PRIMARY KEY (id)
);

CREATE USER 'commonuser'@'%' IDENTIFIED BY 'gabsmailer!123';
GRANT Insert ON gabs_mailer.sent_emails  TO 'commonuser'@'%';