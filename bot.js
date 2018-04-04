const Discord = require("discord.js")
var auth = require('./secret.json')
var yaml = require('js-yaml')
var fs = require('fs')
var _ = require('lodash')

let config = yaml.load(fs.readFileSync('./config.yml', {encoding: 'utf-8'}))
const client = new Discord.Client()

client.on("ready", () => {
  console.log("I am ready!")
});

client.on("message", (message) => {
  // console.log(message)
  if (message.author.bot) {return} // prevent botception

  _.each(config.commands, (command) => {
    if(command.mentionRequired && _.find(message.mentions.users.array(), (userMention) => {
      return userMention.id == auth.clientId
    })) {
      const msg = _.lowerCase(_.trim(_.replace(message.content, config.mentionMe, '')))
      if (_.find(command.cmds, (cmd)=> cmd)) {
        // console.log('found a command: ', command)
        message.channel.send(command.response)
      }
    }
  })
});

client.login(auth.token);
