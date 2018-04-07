var _ = require('lodash')
import {parseMessageToArgs} from '../parse/util'

export const validateSprintWithEndTime = (start, end) => {
  // TODO these validate methods are not unit tested directly yet
  return start >= 0 && start < 60 && end >= 0 && end < 60
}

export const validateSprintWithDuration = (start, duration) => {
  // TODO these validate methods are not unit tested directly yet
  return start >= 0 && start < 60 && duration >= 1 && duration <= 60
}

export const help =
  'There are a lot of ways to start a sprint! Other sprint commands you might care about are "cancel" and "info".'
/*
Examples:
ANYONE WANT TO SPRINT AT 25?
I want to sprint at :45
let's sprint 40 to 45
sprint 15
sprint 15 to 25
sprint 15 to :35
sprint 57 for 32
sprint :15
sprint at 20
sprint at 25
sprint at 27 for 10 min
sprint at 30
sprint at 30 for 14
sprint at 35 for 14
sprint at 35 to 20
sprint at 55 for 55
shall we sprint :20 for about 55 min?
sprint 30 for 34 minutes
sprint at 20 for 6 min
///should we go at 10?
(also compile a list from all the tests! THEY'RE ALL OVER!)
*/
export const commands = [
  {
    command: [ 'sprint', 'at', 'Number', 'to', 'Number' ],
    args: (now, args) => {
      return [ now, args[2], args[4] ]
    },
    // TODO validate + call has only 2 templates in this list, but each has a few different command + args to get there
    // TODO ... and the args functions could easily be derrived from the commands, considering it's just now + the indices of 'Nummber'.... ... well except for where there are defaults....
    validate: args => {
      return validateSprintWithEndTime(args[1], args[2])
    },
    call: args => {
      return generateSprintWithEndTime(args[0], args[1], args[2])
    },
  },
  {
    command: [ 'sprint', 'Number', 'to', 'Number' ],
    args: (now, args) => {
      return [ now, args[1], args[3] ]
    },
    validate: args => {
      return validateSprintWithEndTime(args[1], args[2])
    },
    call: args => {
      return generateSprintWithEndTime(args[0], args[1], args[2])
    },
  },
  {
    command: [ 'sprint', 'at', 'Number', 'for', 'Number' ],
    args: (now, args) => {
      return [ now, args[2], args[4] ]
    },
    validate: args => {
      return validateSprintWithDuration(args[1], args[2])
    },
    call: args => {
      return generateSprintWithDuration(args[0], args[1], args[2])
    },
  },
  {
    command: [ 'sprint', 'Number', 'for', 'Number' ],
    args: (now, args) => {
      return [ now, args[1], args[3] ]
    },
    validate: args => {
      return validateSprintWithDuration(args[1], args[2])
    },
    call: args => {
      return generateSprintWithDuration(args[0], args[1], args[2])
    },
  },
  {
    command: [ 'sprint', 'at', 'Number' ],
    args: (now, args) => {
      return [ now, args[2], 30 ]
    },
    validate: args => {
      return validateSprintWithDuration(args[1], args[2])
    },
    call: args => {
      return generateSprintWithDuration(args[0], args[1], args[2])
    },
  },
  {
    command: [ 'sprint', 'Number' ],
    args: (now, args) => {
      return [ now, args[1], 30 ]
    },
    validate: args => {
      return validateSprintWithDuration(args[1], args[2])
    },
    call: args => {
      return generateSprintWithDuration(args[0], args[1], args[2])
    },
  },
]

export const createSprintFromMessage = (message, timestamp) => {
  // timestamp -> pass in Message.createdTimestamp ie 1522815707792
  const config = _.find(commands, config => {
    return parseMessageToArgs(message, config.command)
  })
  if (config) {
    const args = config.args(
      new Date(timestamp),
      parseMessageToArgs(message, config.command)
    )
    if (config.validate(args)) {
      const sprint = config.call(args)
      return sprint
    }
  }
}

export const generateSprintWithDuration = (now, startMin, duration) => {
  // now, a datetime TODO test inputs are valid
  // start, a number between 0 and 59
  // duration, a number between 1 and 60
  const start = new Date(now)
  start.setMinutes(startMin)
  start.setSeconds(0)
  start.setMilliseconds(0)
  let timeout = start.getTime() - now.getTime()
  if (timeout < 0) {
    start.setHours(start.getHours() + 1)
    timeout = start.getTime() - now.getTime()
  }
  const end = new Date(start)
  end.setMinutes(end.getMinutes() + duration)
  return {
    start: start,
    end: end,
  }
}

export const generateSprintWithEndTime = (now, startMin, endMin) => {
  // now, a datetime
  // startMin, a number between 0 and 59
  // endMin, a number between 0 and 59
  const start = new Date(now)
  start.setMinutes(startMin)
  start.setSeconds(0)
  start.setMilliseconds(0)
  let timeout = start.getTime() - now.getTime()
  if (timeout < 0) {
    start.setHours(start.getHours() + 1)
    timeout = start.getTime() - now.getTime()
  }
  const end = new Date(start)
  end.setMinutes(endMin)
  if (end <= start) {
    end.setHours(end.getHours() + 1)
  }
  return {
    start: start,
    end: end,
  }
}
