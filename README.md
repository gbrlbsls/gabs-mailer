# Gabs-Mailer
    A simple service that runs chronologically and sends mails.

# Prerequisites 
- MySQL (tested on 8)
- Node (tested on 16.10)

# How to use
**1.** Create a table on your database with any name you want(configure **config.json**), but with the following columns: id, subject, body, email_to, emails_cc, status

    - Status default value must be 0
        All status values are:
            0 - TO SEND
            1 - SENDING
            2 - SENT

    - If you prefer, you can change those names and remap in **config.json**

**2.** Configure **config.json**

**3.** Run the service with node

    3.1         npm install

    3.2         npm run start
    
OR 

**3.** Run the service with docker-compose

    3.1         docker-compose up -d

    3.2         docker logs -f gabs_mailer

**4.** Test adding some email to the created table setting the status to 0