import {Bot} from './bot/Bot.js'
const Discord = require('discord.js')
var auth = require('./secret.json')

const bot = new Bot(new Discord.Client())

bot.client.login(auth.token)
