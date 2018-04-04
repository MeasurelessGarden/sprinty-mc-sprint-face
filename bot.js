const Discord = require("discord.js");

var auth = require('./secret.json');
var yaml = require('js-yaml')
var fs = require('fs')
let test = yaml.load(fs.readFileSync('./test.yml', {encoding: 'utf-8'}))//require('./test.yml')
console.log(test)

const client = new Discord.Client();

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
  // console.log(message)
  if (message.author.bot) {return;}
  if (message.content.startsWith("ping")) {
    message.channel.send("pong!\nfooo");
  }
  if (message.content.startsWith("help")) {
    message.channel.send(test.cat);
  }
});

client.login(auth.token);
