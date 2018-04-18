import {Bot} from './bot/Bot.js'
const Discord = require('discord.js')

let token = undefined
try {
  var auth = require('./secret.json')
  token = auth.token
} catch (err) {
  // console.error(err)
  token = process.env.token
}

const bot = new Bot(new Discord.Client())

bot.client.login(token)
