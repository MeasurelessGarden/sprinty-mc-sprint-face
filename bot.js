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

const dmOnMatchingCommand = (message, command) => {
  const msg = _.toLower(_.trim(_.replace(message.content, config.mentionMe, '')))
  if (_.find(command.cmds, (cmd)=> {return cmd == msg })) {
    message.author.send(command.response)
  }
}

client.on("message", (message) => {
  // console.log(message)
  if (message.author.bot) {return} // prevent botception

  _.each(config.commands, (command) => {
    if(command.mentionRequired) {
      if( message.channel.type == 'dm') {
        // console.log(message.channel)
        // console.log(message.content)
        // const msg = _.lowerCase(_.trim(_.replace(message.content, config.mentionMe, '')))
        // if (_.find(command.cmds, (cmd)=> {return cmd == msg })) {
        //   message.author.send(command.response)
        // }
        dmOnMatchingCommand(message, command)
      }
      else if( _.find(message.mentions.users.array(), (userMention) => {
        return userMention.id == auth.clientId
      })) {
        // const msg = _.lowerCase(_.trim(_.replace(message.content, config.mentionMe, '')))
        // if (_.find(command.cmds, (cmd)=> {return cmd == msg })) {
        //   // console.log('found a command: ', command)
        //   // message.channel.send(command.response)
        //   message.author.send(command.response)
        // }

        dmOnMatchingCommand(message, command)
    }
    }
  })

});

client.login(auth.token);
