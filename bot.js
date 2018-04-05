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

const cache = {}

const dmOnMatchingCommand = (message, command) => {
  const msg = _.toLower(_.trim(_.replace(message.content, config.mentionMe, '')))
  if (_.find(command.cmds, (cmd)=> {return cmd == msg })) {
    message.author.send(command.response)
  }
}

const mentionOrDmBotCommand = (message, command) => {
  if(command.mentionRequired) {
    if( message.channel.type == 'dm') {
      dmOnMatchingCommand(message, command)
    }
    else
    if( _.find(message.mentions.users.array(), (userMention) => {
      return userMention.id == auth.clientId
    })) {
      dmOnMatchingCommand(message, command)
    }
  }
}

const startSprint = (id) => {
  cache[id].channel.send(":ghost:")
}
const endSprint = (id) => {
  cache[id].channel.send("STOP")
}
const textChannelMention = (message) => {
  const msg = _.toLower(_.trim(message.content))
  if (msg == "join" ) {
    console.log('join does nothing, but here is the cache', cache)
  }
  if(_.startsWith(msg, 'sprint at ')) {
    const args = _.split(_.trim(_.replace(msg, 'sprint at ', '')), ' ')
    console.log(args.length == 3 ,
      args[1] == 'to' ,
      Number(args[0]) >= 0 , Number(args[0]) < 60 ,
      Number(args[2]) >= 0 , Number(args[2]) < 60)
      console.log(args)
    if(args.length == 3 &&
      args[1] == 'to' &&
      Number(args[0]) >= 0 && Number(args[0]) < 60 &&
      Number(args[2]) >= 0 && Number(args[2]) < 60) {
      const now = new Date()
      const start = new Date()
      const end = new Date()
      start.setMinutes(Number(args[0]))
      start.setSeconds(0)
      start.setMilliseconds(0)
      timeout = start.getTime() - now.getTime()
      if (timeout < 0) {
        start.setHours(start.getHours() + 1)
        timeout = start.getTime() - now.getTime()
      }
      end.setHours(start.getHours())
      end.setMinutes(Number(args[2]))
      if (end < start) {
        end.setHours(end.getHours() + 1)
      }
      end.setSeconds(0)
      end.setMilliseconds(0)
      client.setTimeout( startSprint, timeout, start.getTime())
      client.setTimeout( endSprint, end.getTime() - now.getTime(), start.getTime())
      cache[start.getTime()] = { // sprint definition
        start: start,
        end: end,
        channel: message.channel,
      }
    }
    if(args.length == 1 && Number(args[0]) >= 0 && Number(args[0]) < 60) {
      const now = new Date()
      const start = new Date()
      const end = new Date()
      start.setMinutes(Number(args[0]))
      start.setSeconds(0)
      start.setMilliseconds(0)
      timeout = start.getTime() - now.getTime()
      if (timeout < 0) {
        start.setHours(start.getHours() + 1)
        timeout = start.getTime() - now.getTime()
      }
      const defaultMinutes = 2
      end.setHours(start.getHours())
      end.setMinutes(start.getMinutes() + defaultMinutes)
      end.setSeconds(0)
      end.setMilliseconds(0)
      client.setTimeout( startSprint, timeout, start.getTime())
      client.setTimeout( endSprint, end.getTime() - now.getTime(), start.getTime())
      cache[start.getTime()] = { // sprint definition
        start: start,
        end: end,
        channel: message.channel,
      }

    }

  }

}

client.on("message", (message) => {
  // console.log(message)
  if (message.author.bot) {return} // prevent botception

  _.each(config.commands, (command) => {
    mentionOrDmBotCommand(message, command)
  })

  textChannelMention(message)

});

client.login(auth.token);
