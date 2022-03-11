CREATE TABLE sent_emails (
	id INT auto_increment NOT NULL,
	subject varchar(256) DEFAULT '' NOT NULL,
	body TEXT NOT NULL,
	email_to varchar(256) DEFAULT '' NOT NULL,
	emails_cc TEXT NOT NULL,
	status INT DEFAULT 0 NOT NULL,
	CONSTRAINT sent_emails_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci
COMMENT='Status:
0 - To sent
1 - Sending
2 - Sent';

