# Requirements

- Discord accound
- node.js installed

# Set up a test bot

1. Go to https://discordapp.com/developers/applications/me and create a bot (make sure to add a bot user!)
1. Copy resources/template.json to src/secret.json and fill in both values
1. Update the following URL with your bot client id, https://discordapp.com/oauth2/authorize?&client_id=BOT_CLIENT_ID&scope=bot&permissions=0, then use it to add the bot to a server - wherever you want to test and/or run i.

# Run the bot locally

1. npm install
1. npm run bot

# Development commands

1. npm run format
1. npm run test

# Deploy

1. install heroku cli
1. create and set up a heroku app and remote
1. git push heroku master
1. heroku ps:scale worker=1
