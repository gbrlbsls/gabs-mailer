# Gabs-Mailer
A simple service that runs chronologically and sends mails.

# Prerequisites 
- MariaDB (tested on mariadb:10.2.41)
- NodeJS (tested on 16.10)
- An smtp capable email server (tested with gmail and hotmail)

# How to use
**1.** Create a table on your database with any name you want(configure **config.json**), but with the following columns: 
- id

    unique
    
    primary key

- subject

    varchar
    
    not null default ""

- body

    text
    
    not null default ""

- email_to

    varchar
    
    not null default ""

- emails_cc

    varchar or text, this will be a comma separated emails string
    
    not null default ""
    
    ex: "mail1@mail.com,mail2@mail.com"

- status

    int
    
    default 0

If you prefer, you can change those names and remap in **config.json**

All status values are:

    0 - TO SEND
    
    1 - SENDING
    
    2 - SENT

**2.** Configure **config.json**

**3.** Run the service with node

    npm install

    npm run start
    
OR 

**3.** Run the service with docker-compose

    docker-compose up -d

    docker logs -f gabs_mailer

**4.** Test adding some email to the created table setting the status to 0

    INSERT INTO gabs_mailer.sent_emails (subject, body, email_to, emails_cc, status) 
    VALUES('Some awesome subject', 'An email <b>bold</b> body', 'somemail@address.com', 'somemailcc@address.com,maybe@morethanone.com', 0);
