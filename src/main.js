import {Bot} from './bot/Bot.js'
import {changelog} from './db/changelog.js'

const Discord = require('discord.js')

let token = undefined
let database = undefined
try {
  var auth = require('./secret.json')
  token = auth.token
  database = auth.postgres
} catch (err) {
  // console.error(err)
  token = process.env.token
  database = process.env.DATABASE_URL
}

const bot = new Bot(new Discord.Client())

// bot.client.login(token)

changelog(database)
