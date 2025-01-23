I used this guide to set up my server: https://youtu.be/Oy5HGvrxM4o?si=OiitTShQquTSZ8Ca

To run the bot there are a few steps

Run the command: npm init -y

Run the command: npm i discord.js

Run  the command: npm i dotenv

Enter your own discord token in the .env file

To start the bot in the server use: node index.js

Alternatively you can host this bot on a remote server, like droplet or google app engines:

To start the bot with google app engines use: gcloud app deploy

To stop the bot with google app engines use: gcloud app services update default --no-serving

MAKE SURE TO ONKY HAVE THE BOT RUNNING IN ONE INSTANCE AT A TIME!!!