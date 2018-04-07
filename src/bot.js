import {
  preparseMessage, // cleanup
  parse, //cleanup
  convertFunctionArgs, //cleanup
  parseMessageToArgs,
} from './parse/util.js'
import {
  generateSprintWithDuration,
  generateSprintWithEndTime,
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

const cache = {}

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
// export const funcTest = (cache, id) => {
//   cache[id].channel.send('foo')
// }

const startSprint = id => {
  cache[id].channel.send(':ghost:')
}
const endSprint = id => {
  cache[id].channel.send('STOP')
}

const testNewFuncs = message => {
  const commands = [
    {
      command: [ 'sprint', 'at', 'Number', 'to', 'Number' ],
      call: args => {
        return generateSprintWithEndTime(new Date(), args[2], args[4])
      },
    },
    {
      command: [ 'sprint', 'Number', 'to', 'Number' ],
      call: args => {
        return generateSprintWithEndTime(new Date(), args[1], args[3])
      },
    },
    {
      command: [ 'sprint', 'at', 'Number', 'for', 'Number', 'min' ],
      call: args => {
        return generateSprintWithDuration(new Date(), args[2], args[4])
      },
    },
    {
      command: [ 'sprint', 'at', 'Number', 'for', 'Number' ],
      call: args => {
        return generateSprintWithDuration(new Date(), args[2], args[4])
      },
    },
    {
      command: [ 'sprint', 'Number', 'for', 'Number', 'min' ],
      call: args => {
        return generateSprintWithDuration(new Date(), args[1], args[3])
      },
    },
    {
      command: [ 'sprint', 'Number', 'for', 'Number' ],
      call: args => {
        return generateSprintWithDuration(new Date(), args[1], args[3])
      },
    },
    {
      command: [ 'sprint', 'at', 'Number' ],
      call: args => {
        return generateSprintWithDuration(new Date(), args[2], 30)
      },
    },
    {
      command: [ 'sprint', 'Number' ],
      call: args => {
        return generateSprintWithDuration(new Date(), args[1], 30)
      },
    },
  ]
  const config = _.find(commands, config => {
    return parseMessageToArgs(message, config.command)
  })
  if (config) {
    console.log('matched:', config)
    const sprint = config.call(parseMessageToArgs(message, config.command))
    console.log('sprint:', sprint)
  }
}

const testNewFuncs1 = message => {
  const command = [ 'sprint', 'at', 'Number' ]
  // sprint Number to Number
  // sprint Number for Number
  let m = parse(preparseMessage(message), command)
  if (m.length == command.length) {
    let args = convertFunctionArgs(m, command)
    // TODO map command to which args are input to what function..., other features like new Date()
    let sprint = generateSprintWithDuration(new Date(), args[2], 30)
    // TODO generate timeout stuff from sprint, now, etc
    // TODO figure out how channel gets piped into callback (or is the configured channel static enough..)
    // console.log('generated a sprint', sprint)

    console.log('x1', 'messge:', message)
    console.log('x1', 'command:', command)
    console.log('x1', 'parsed:', m)
    console.log('x1', 'args:', args)
    console.log('x1', 'N1:', args[2])
    console.log('x1', 'N2 (hardcoded):', 30)
    console.log('x1', 'sprint:', sprint)
  }
}
const testNewFuncs2 = message => {
  const command = [ 'sprint', 'Number', 'for', 'Number', 'min' ]
  // sprint Number for Number min
  let m = parse(preparseMessage(message), command)
  if (m.length == command.length) {
    let args = convertFunctionArgs(m, command)
    // TODO map command to which args are input to what function..., other features like new Date()
    let sprint = generateSprintWithDuration(new Date(), args[1], args[3])
    // TODO generate timeout stuff from sprint, now, etc
    // TODO figure out how channel gets piped into callback (or is the configured channel static enough..)
    // console.log('x2', 'message', message, 'command', command, 'parsed', m, 'args', args, 'N1', args[1], 'N2', args[3], 'sprint', sprint)
    console.log('x2', 'messge:', message)
    console.log('x2', 'command:', command)
    console.log('x2', 'parsed:', m)
    console.log('x2', 'args:', args)
    console.log('x2', 'N1:', args[1])
    console.log('x2', 'N2:', args[3])
    console.log('x2', 'sprint:', sprint)
  }
}
const testNewFuncs3 = message => {
  const command = [ 'sprint', 'Number', 'to', 'Number' ]
  // sprint Number to Number
  let m = parse(preparseMessage(message), command)
  if (m.length == command.length) {
    let args = convertFunctionArgs(m, command)
    // TODO map command to which args are input to what function..., other features like new Date()
    let sprint = generateSprintWithEndTime(new Date(), args[1], args[3])
    // TODO generate timeout stuff from sprint, now, etc
    // TODO figure out how channel gets piped into callback (or is the configured channel static enough..)
    // console.log('generated a sprint x3', sprint)
    console.log('x3', 'messge:', message)
    console.log('x3', 'command:', command)
    console.log('x3', 'parsed:', m)
    console.log('x3', 'args:', args)
    console.log('x3', 'N1:', args[1])
    console.log('x3', 'N2:', args[3])
    console.log('x3', 'sprint:', sprint)
  }
}

const textChannelMention = message => {
  const msg = _.toLower(_.trim(message.content))
  if (msg == 'join') {
    console.log('join does nothing, but here is the cache', cache)
  }
  if (_.startsWith(msg, 'sprint at ')) {
    const args = _.split(_.trim(_.replace(msg, 'sprint at ', '')), ' ')
    console.log(
      args.length == 3,
      args[1] == 'to',
      Number(args[0]) >= 0,
      Number(args[0]) < 60,
      Number(args[2]) >= 0,
      Number(args[2]) < 60
    )
    console.log(args)
    if (
      args.length == 3 &&
      args[1] == 'to' &&
      Number(args[0]) >= 0 &&
      Number(args[0]) < 60 &&
      Number(args[2]) >= 0 &&
      Number(args[2]) < 60
    ) {
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
      client.setTimeout(startSprint, timeout, start.getTime())
      client.setTimeout(
        endSprint,
        end.getTime() - now.getTime(),
        start.getTime()
      )
      cache[start.getTime()] = {
        // sprint definition
        start: start,
        end: end,
        channel: message.channel,
      }
    }
    if (args.length == 1 && Number(args[0]) >= 0 && Number(args[0]) < 60) {
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
      client.setTimeout(startSprint, timeout, start.getTime())
      client.setTimeout(
        endSprint,
        end.getTime() - now.getTime(),
        start.getTime()
      )
      cache[start.getTime()] = {
        // sprint definition
        start: start,
        end: end,
        channel: message.channel,
      }
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

  // textChannelMention(message)

  testNewFuncs(message.content)
  // testNewFuncs2(message.content)
  // testNewFuncs3(message.content)
})

client.login(auth.token)
