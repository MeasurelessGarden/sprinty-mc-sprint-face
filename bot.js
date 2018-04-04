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
const textChannelMention = (message, command) => {
  if(!command.mentionRequired) {
    const msg = _.toLower(_.trim(message.content))
    // console.log(msg, command)
    const cmd = _.find(command.startsWith, (cmd)=> { return msg.startsWith(cmd) })
    if(cmd) {
      const args = _.split(_.trim(_.replace(msg, cmd, '')))
      console.log(args)
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
      target.setMinutes(Number(args[0]))
      target.setSeconds(0)
      target.setMilliseconds(0)
      timeout = target.getTime() - now.getTime()
      console.log(now, target, now.getTime(), target.getTime(), timeout)
      if (timeout > 0) {
        console.log('setting a timeout in ...', timeout)
        client.setTimeout( debugMe, timeout, 'hi')
      } else {
        target.setHours(target.getHours() + 1)
        timeout = target.getTime() - now.getTime()
        client.setTimeout( debugMe, timeout, 'wrap')
      }


    }

  }
}

client.on("message", (message) => {
  // console.log(message)
  if (message.author.bot) {return} // prevent botception

  _.each(config.commands, (command) => {
    mentionOrDmBotCommand(message, command)
    textChannelMention(message, command)
  })

});

client.login(auth.token);
