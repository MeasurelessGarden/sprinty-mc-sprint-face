import {Bot} from './bot/Bot.js'
import {changelog} from './db/changelog.js'
import {Guild} from './db/Guild.js'

const Discord = require('discord.js')

let token = undefined
let databaseUrl = undefined
try {
  var auth = require('./secret.json')
  token = auth.token
  databaseUrl = auth.postgres
} catch (err) {
  // console.error(err)
  token = process.env.token
  databaseUrl = process.env.DATABASE_URL
}

const bot = new Bot(new Discord.Client(), new Guild(databaseUrl))

bot.client.login(token)

changelog(databaseUrl)
