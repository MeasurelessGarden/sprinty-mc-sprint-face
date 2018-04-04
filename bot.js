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

  // if (_.has(message.mentions.users, auth.clientId)) {
  //   console.log("You are talking to me")
  // } else {
  //   console.log("you're not talking to me")
  //   // console.log(message.mentions.users.array())
  //   _.each(message.mentions.users.array(), (userMention) => {
  //     console.log("user??", userMention.id)
  //   })
  // }
  _.each(config.commands, (command) => {
    if(_.find(command.cmds, (cmd) => { return message.content == cmd})) {
      message.channel.send(command.response)
    }
  })
});

client.login(auth.token);
