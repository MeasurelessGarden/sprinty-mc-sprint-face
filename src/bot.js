import {sprintCommands} from './commands/sprintCommand.js'
import {helpCommands} from './commands/helpCommand.js'
import {createObjFromMessage} from './commands/parseUtils.js'
const Discord = require('discord.js')
var auth = require('./secret.json')
var yaml = require('js-yaml')
var fs = require('fs')
var _ = require('lodash')

let config = yaml.load(fs.readFileSync('./config.yml', {encoding: 'utf-8'}))
const client = new Discord.Client()

client.on('ready', () => {
  console.log('I am ready!')
})

const cache = {timeout: {}}

const triggerHelpCommands = (message, timestamp, channel) => {
  if (channel) {
    const help = createObjFromMessage(helpCommands, message, timestamp)
    if (help) {
      channel.send(help)
    }
  }
}

const startSprint = () => {
  cache.channel.send(':ghost:')
  client.clearTimeout(cache.timeout.startId)
}
const endSprint = () => {
  cache.channel.send('STOP')
  client.clearTimeout(cache.timeout.endId)
  cache.timeout = {}
}

const triggerSprintCommands = (message, timestamp, channel) => {
  const sprint = createObjFromMessage(sprintCommands, message, timestamp)
  if (sprint) {
    if (cache.timeout.end) {
      return 'ERR_SPRINT_RUNNING_ALREADY'
    }
    const timeout = {
      start: sprint.start.getTime() - timestamp,
      end: sprint.end.getTime() - timestamp,
    }
    cache.channel = channel
    cache.timeout = timeout
    cache.start = sprint.start
    cache.end = sprint.end
    cache.timeout.startId = client.setTimeout(startSprint, timeout.start)
    cache.timeout.endId = client.setTimeout(endSprint, timeout.end)
    return 'OK_SPRINT_SET' // TODO need constants apparently....
  }
  if (message === 'info') {
    const now = new Date()
    if (cache.timeout.end) {
      if (cache.start < now) {
        let until = cache.end.getTime() - now.getTime()
        until = `${until / 1000 / 60}`
        until = _.replace(until, /\..*/, '')
        channel.send(`There's a sprint right now, for about ${until} minutes.`)
      }
      else {
        let from = cache.start.getTime() - now.getTime()
        from = `${from / 1000 / 60}`
        from = _.replace(from, /\..*/, '')
        let until = cache.end.getTime() - now.getTime()
        until = `${until / 1000 / 60}`
        until = _.replace(until, /\..*/, '')
        channel.send(
          `There's a sprint in about ${from} minutes, something like ${until -
            from} minutes.`
        )
      }
    }
    else {
      return 'NO_SPRINT_TO_INFO'
    }
  }
  if (message === 'cancel') {
    if (cache.timeout.end) {
      client.clearTimeout(cache.timeout.startId)
      client.clearTimeout(cache.timeout.endId)
      cache.timeout = {}
      return 'OK_SPRINT_CANCELLED'
    }
  }
}

client.on('message', message => {
  // console.log(message)
  if (message.author.bot) {
    return
  } // prevent botception

  triggerHelpCommands(
    message.content,
    message.createdTimestamp,
    _.find(message.mentions.users.array(), userMention => {
      return userMention.id == auth.clientId
    })
      ? message.author
      : message.channel.type == 'dm' ? message.channel : null
  )

  let result = triggerSprintCommands(
    message.content,
    message.createdTimestamp,
    message.channel
  )
  if (result === 'ERR_SPRINT_RUNNING_ALREADY') {
    message.react('😦')
  }
  if (result === 'OK_SPRINT_SET') {
    message.react('💯')
  }
  if (result === 'OK_SPRINT_CANCELLED') {
    message.react('👍')
  }
  if (result === 'NO_SPRINT_TO_INFO') {
    message.react('🤖')
  }
})

client.login(auth.token)
