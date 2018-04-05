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
    // const nowMins = now.getMinutes()
    /*
    const startSeconds = Number(args[0])*60
    const nowSeconds = now.getMinutes()*60 + now.getSeconds()
    // console.log(nowMins*60+)
    // console.log((Number(args[0])+60-nowMins)*1000)
    if (startSeconds > nowSeconds) {
      // console.log('start in ', start - nowMins)
      client.setInterval(debugMe, (startSeconds > nowSeconds)*1000*60, 'testing interval')
      client.setTimeout(debugMe, (startSeconds > nowSeconds)*1000*60, 'testing timeout')
    } else {
      // TODO
    }*/
    const target = new Date()
    const end = new Date()
    target.setMinutes(Number(args[0]))
    target.setSeconds(0)
    target.setMilliseconds(0)
    end.setMinutes(Number(args[0]) + 1) // TODO make this wrap over hours yo (not to mention configurable)
    end.setSeconds(0)
    end.setMilliseconds(0)
    timeout = target.getTime() - now.getTime()
    console.log(now, target, now.getTime(), target.getTime(), timeout)
    if (timeout > 0) {
      console.log('setting a timeout in ...', timeout)
      client.setTimeout( debugMe, timeout, 'hi')
      client.setTimeout( debugMe, end.getTime() - now.getTime(), 'done')
      cache[target.getTime()] = {
        start: target,
        end: end,
        participants: []
      }
    } else {
      // console.log('???', target)
      target.setHours(target.getHours() + 1)
      timeout = target.getTime() - now.getTime()
      client.setTimeout( debugMe, timeout, 'wrap')
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
