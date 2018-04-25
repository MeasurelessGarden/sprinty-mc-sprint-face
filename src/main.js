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

// postgres experimentation

const {Client} = require('pg')

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
})

client.connect()

client.query(
  'SELECT table_schema,table_name FROM information_schema.tables;',
  (err, res) => {
    if (err) throw err
    for (let row of res.rows) {
      console.log(JSON.stringify(row))
    }
    client.end()
  }
)
