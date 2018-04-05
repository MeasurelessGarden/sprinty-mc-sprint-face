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

const debugMe = (debugMessage) => {
  console.log("triggering ", debugMessage, new Date())
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
  console.log('wtf?', msg, _.startsWith(msg, 'sprint at '))
  if(_.startsWith(msg, 'sprint at ')) {
    const args = _.split(_.trim(_.replace(msg, 'sprint at ', '')))
    console.log(args, args.length)
    if(args.length == 1 && Number(args[0]) >= 0 && Number(args[0]) < 60) {
      console.log('valid')
    } else { console.log('invalid', args.length == 1,Number(args[0]) , Number(args[0]) >= 0,  Number(args[0]) < 60)}
    const now = new Date()
    const start = new Date()
    const end = new Date()
    start.setMinutes(Number(args[0]))
    start.setSeconds(0)
    start.setMilliseconds(0)
    timeout = start.getTime() - now.getTime()
    /*
    if (timeout > 0) {
      console.log('setting a timeout in ...', timeout)
      client.setTimeout( debugMe, timeout, 'hi')
      client.setTimeout( debugMe, end.getTime() - now.getTime(), 'done')
      cache[target.getTime()] = {
        start: start,
        end: end,
        participants: []
      }
    } else {
      // console.log('???', target)
      start.setHours(start.getHours() + 1)
      timeout = start.getTime() - now.getTime()
      client.setTimeout( debugMe, timeout, 'wrap')
    }*/
    if (timeout < 0) {
      start.setHours(start.getHours() + 1)
      timeout = start.getTime() - now.getTime()
    }
    const defaultMinutes = 2
    end.setHours(start.getHours())
    end.setMinutes(start.getMinutes() + defaultMinutes)
    end.setSeconds(0)
    end.setMilliseconds(0)
    console.log('setting a timeout in ...', timeout)
    client.setTimeout( startSprint, timeout, start.getTime())
    client.setTimeout( endSprint, end.getTime() - now.getTime(), start.getTime())
    cache[start.getTime()] = {
      start: start,
      end: end,
      channel: message.channel,
      // participants: []
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
