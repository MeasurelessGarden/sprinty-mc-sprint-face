import {
  createSprintFromMessage,
  commands as SprintCommands,
  help as SprintHelp,
} from './sprint/generator.js'
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
    if (command.showHelp) {
      let sprintHelp = SprintHelp + '\n'
      _.each(SprintCommands, sprintCommand => {
        // console.log('asdfasfasdf', _.join(sprintCommand.command, ' '))
        sprintHelp = sprintHelp + '\n' + _.join(sprintCommand.command, ' ')
      })
      message.author.send(sprintHelp)
    }
    // console.log('wooo?',SprintCommands)
    // _.each(SprintCommands, sprintCommand => {
    //   console.log('????', sprintCommand)
    // })
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
  client.clearTimeout(cache.timeout.startId)
}
const endSprint = () => {
  cache.channel.send('STOP')
  client.clearTimeout(cache.timeout.endId)
  cache.timeout = {}
}

const triggerSprintCommands = (message, timestamp, channel) => {
  const sprint = createSprintFromMessage(message, timestamp)

  if (sprint) {
    if (cache.timeout.end) {
      return 'ERR_SPRINT_RUNNING_ALREADY'
    }
    const timeout = {
      start: sprint.start.getTime() - timestamp,
      end: sprint.end.getTime() - timestamp,
    }
    //   react(':100:').then(console.log)
    // .catch(console.error)
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

  _.each(config.commands, command => {
    mentionOrDmBotCommand(message, command)
  })

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
