const Discord = require("discord.js")
var auth = require('./secret.json')
var yaml = require('js-yaml')
var fs = require('fs')
let responses = yaml.load(fs.readFileSync('./responses.yml', {encoding: 'utf-8'}))

const client = new Discord.Client()

client.on("ready", () => {
  console.log("I am ready!")
});

client.on("message", (message) => {
  // console.log(message)
  if (message.author.bot) {return;}
  if (message.content.startsWith("ping")) {
    message.channel.send("pong!\nfooo")
  }
  if (message.content.startsWith("help")) {
    message.channel.send(responses.helpMessage)
  }
});

client.login(auth.token);
