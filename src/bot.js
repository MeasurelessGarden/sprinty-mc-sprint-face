import {sprintCommands} from './commands/sprintCommand.js'
import {helpCommands} from './commands/helpCommand.js'
import {createObjFromMessage} from './utils/parseUtils.js'
import {runSprintCommand, runCancelSprintCommand} from './bot/helper.js'

const Discord = require('discord.js')
var auth = require('./secret.json')
var fs = require('fs')
var _ = require('lodash')

const client = new Discord.Client()

client.on('ready', () => {
  console.log('I am ready!')
})

const cache = {timeout: {}}

const triggerHelpCommands = (message, timestamp, channel) => {
  if (channel) {
    const help = createObjFromMessage(helpCommands, message, timestamp)
    if (help) {
      if (_.split(help, '\n').length > 40) {
        // TODO maybe just have help return arrays instead of joining \n\n just to split it again here? then the helper function can make an array of blocks to send
        // can't send ultra-long messages
        const blocks = _.split(help, '\n\n')
        let block = _.take(blocks, 4)
        channel.send(_.join(block, '\n\n'))
        let working = _.slice(blocks, 4) //_.xorWith(blocks, block, _.isEqual)//_.without(blocks, block)
        while (working.length > 0) {
          block = _.take(working, 4)
          channel.send(_.join(block, '\n\n'))
          working = _.slice(working, 4) //_.without(working, block)
        }
      }
      else {
        channel.send(help)
      }
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
  // const sprint = createObjFromMessage(sprintCommands, message, timestamp)
  const sprint = runSprintCommand(message, timestamp)
  if (sprint) {
    //   // TODO if I mock out cache, client, and channel, I can move this whole block into a tested method probably
    if (cache.timeout.end) {
      return 'ERR_SPRINT_RUNNING_ALREADY'
    }
    cache.channel = channel
    cache.timeout = sprint.timeout
    cache.sprint = sprint.sprint
    cache.timeout.startId = client.setTimeout(startSprint, cache.timeout.start)
    cache.timeout.endId = client.setTimeout(endSprint, cache.timeout.end)
    return 'OK_SPRINT_SET' // TODO need constants apparently....
  }

  if (message === 'info') {
    const now = new Date().getTime()
    if (cache.timeout.end) {
      if (cache.start < now) {
        let until = cache.sprint.end - now
        until = `${until / 1000 / 60}`
        until = _.replace(until, /\..*/, '')
        channel.send(`There's a sprint right now, for about ${until} minutes.`)
      }
      else {
        let from = cache.sprint.start - now
        from = `${from / 1000 / 60}`
        from = _.replace(from, /\..*/, '')
        let until = cache.sprint.end - now
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
  if (runCancelSprintCommand(message, timestamp)) {
    if (cache.timeout.end) {
      client.clearTimeout(cache.timeout.startId)
      client.clearTimeout(cache.timeout.endId)
      cache.timeout = {}
      return 'OK_SPRINT_CANCELLED'
    }
    else return 'NO_SPRINT_TO_INFO'
  }
}

client.on('message', message => {
  // console.log(message)
  if (message.author.bot) {
    return
  } // prevent botception

  if (message.content.includes('\n')) {
    // ignore multiline messages, they are definitely not commands
    return
  }
  if (_.words(message.content).length > 15) {
    // ignore long messages, they are probably not commands
    return
  }

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
