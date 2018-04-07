import {createSprintFromMessage} from './sprint/generator.js'
const Discord = require('discord.js')
var auth = require('./secret.json')
var yaml = require('js-yaml')
var fs = require('fs')
var _ = require('lodash')

let config = yaml.load(fs.readFileSync('./config.yml', {encoding: 'utf-8'}))
var client = new Discord.Client()

client.on('ready', () => {
  console.log('I am ready!')
})

const cache = {timeout: {}}

const dmOnMatchingCommand = (message, command) => {
  const msg = _.toLower(
    _.trim(_.replace(message.content, config.mentionMe, ''))
  )
  if (
    _.find(command.cmds, cmd => {
      return cmd == msg
    })
  ) {
    message.author.send(command.response)
  }
}

const mentionOrDmBotCommand = (message, command) => {
  if (command.mentionRequired) {
    if (message.channel.type == 'dm') {
      dmOnMatchingCommand(message, command)
    }
    else if (
      _.find(message.mentions.users.array(), userMention => {
        return userMention.id == auth.clientId
      })
    ) {
      dmOnMatchingCommand(message, command)
    }
  }
}

const startSprint = () => {
  cache.channel.send(':ghost:')
  client.clearTimeout(cache.timeout.start)
}
const endSprint = () => {
  cache.channel.send('STOP')
  client.clearTimeout(cache.timeout.end)
  cache.timeout = {}
}
function triggerSprintCommands(message, timestamp, channel, react){
  const sprint = createSprintFromMessage(message, timestamp)

  if (sprint) {
    if (cache.timeout.end) {
      console.log('ugh, scoping', this)
      react('😦')
      // channel.send('A sprint already exists.') // TODO this requires a command to cancel the sprint
      return
      // client.clearTimeout(cache.timeout.start)
      // client.clearTimeout(cache.timeout.end)
      // console.log('clearing old / running sprint', cache.timeout)
    }
    const timeout = {
      start: sprint.start.getTime() - timestamp,
      end: sprint.end.getTime() - timestamp,
    }
    //   react(':100:').then(console.log)
    // .catch(console.error)
    cache.channel = channel
    cache.timeout = timeout
    client.setTimeout(startSprint, timeout.start)
    client.setTimeout(endSprint, timeout.end)
  }
  // TODO info, cancel
}

client.on('message', message => {
  // console.log(message)
  if (message.author.bot) {
    return
  } // prevent botception

  _.each(config.commands, command => {
    mentionOrDmBotCommand(message, command)
  })

  message.react('😦')
  console.log('???', client.emojis, message.guild.emojis)
  triggerSprintCommands(
    message.content,
    message.createdTimestamp,
    message.channel,
    message.react
  )
})

client.login(auth.token)
