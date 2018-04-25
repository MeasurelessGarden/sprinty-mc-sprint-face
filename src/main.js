import {Bot} from './bot/Bot.js'
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

// postgres experimentation
const {Client} = require('pg')
const query = (q, callback) => {
  if (database) {
    const client = new Client({
      connectionString: database,
      ssl: true,
    })

    client.connect()

    client.query(
      q, //callback
      (err, result) => {
        if (err) {
          console.error(err)
        }
        // for (let row of res.rows) {
        //   console.log(JSON.stringify(row))
        // }
        callback(result)
        client.end()
      }
    )
  }
  else {
    console.error('no database found to run', q)
  }
}

query(
  "SELECT table_schema,table_name FROM information_schema.tables t WHERE t.table_name = 'guild_config'",
  result => {
    for (let row of result.rows) {
      console.log(JSON.stringify(row))
    }
  }
)
// (err, result) => {
//   if (err) {console.error(err)}
//   else {
//     for (let row of result.rows) {
//       console.log(JSON.stringify(row))
//     }
//   }
//   client.end()
// })
query(
  "SELECT table_schema,table_name FROM information_schema.tables t WHERE t.table_name = 'foobar'",
  result => {
    console.log(result)
    // TODO result.rowCount
    // for (let row of result.rows) {
    //   console.log(JSON.stringify(row))
    // }
  }
)

const SQL = `CREATE TABLE guild_config (
  guild_id              varchar(20) PRIMARY KEY,
  sprint_channel_id     varchar(20),
  sprint_channel_date   date
);`
// query(SQL)

// if(database) {
//   const {Client} = require('pg')
//
//   const client = new Client({
//     connectionString: database,
//     ssl: true,
//   })
//
//   client.connect()
//
//   client.query(
//     "SELECT table_schema,table_name FROM information_schema.tables t WHERE t.table_name = 'guild_config'",
//     (err, res) => {
//       if (err){ throw err}
//       for (let row of res.rows) {
//         console.log(JSON.stringify(row))
//         client.end()
//
//       }
//     }
//   )
//   const client2 = new Client({
//     connectionString: database,
//     ssl: true,
//   })
//   client2.connect()
//   const SQL = `CREATE TABLE guild_config (
//     guild_id              varchar(20) PRIMARY KEY,
//     sprint_channel_id     varchar(20),
//     sprint_channel_date   date
// );`
//   client2.query(SQL, (err, res)=> {
//     if (err){ throw err}
//     // console.log('create?',res)
//     for (let row of res.rows) {
//       console.log(JSON.stringify(row))
//       client2.end()
//     }
//   })
//
//
// }
// else {
//   console.log('sorry no db for you!')
// }
