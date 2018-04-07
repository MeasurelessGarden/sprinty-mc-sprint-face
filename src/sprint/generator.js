var _ = require('lodash')
import {parseMessageToArgs} from '../parse/util'

const commands = [
  {
    command: [ 'sprint', 'at', 'Number', 'to', 'Number' ],
    call: (now, args) => {
      console.log('testcase 8')
      return generateSprintWithEndTime(now, args[2], args[4])
    },
  },
  {
    command: [ 'sprint', 'Number', 'to', 'Number' ],
    call: (now, args) => {
      console.log('testcase 7')
      return generateSprintWithEndTime(now, args[1], args[3])
    },
  },
  {
    command: [ 'sprint', 'at', 'Number', 'for', 'Number', 'minutes' ],
    call: (now, args) => {
      console.log('testcase 9')
      return generateSprintWithDuration(now, args[2], args[4])
    },
  },
  {
    command: [ 'sprint', 'at', 'Number', 'for', 'Number', 'min' ],
    call: (now, args) => {
      console.log('testcase 6')
      return generateSprintWithDuration(now, args[2], args[4])
    },
  },
  {
    command: [ 'sprint', 'at', 'Number', 'for', 'Number' ],
    call: (now, args) => {
      console.log('testcase 5')
      return generateSprintWithDuration(now, args[2], args[4])
    },
  },
  {
    command: [ 'sprint', 'Number', 'for', 'Number', 'minutes' ],
    call: (now, args) => {
      console.log('testcase 10')
      return generateSprintWithDuration(now, args[1], args[3])
    },
  },
  {
    command: [ 'sprint', 'Number', 'for', 'Number', 'min' ],
    call: (now, args) => {
      console.log('testcase 4')
      return generateSprintWithDuration(now, args[1], args[3])
    },
  },
  {
    command: [ 'sprint', 'Number', 'for', 'Number' ],
    call: (now, args) => {
      console.log('testcase 3')
      return generateSprintWithDuration(now, args[1], args[3])
    },
  },
  {
    command: [ 'sprint', 'at', 'Number' ],
    call: (now, args) => {
      console.log('testcase 1')
      return generateSprintWithDuration(now, args[2], 30)
    },
  },
  {
    command: [ 'sprint', 'Number' ],
    call: (now, args) => {
      console.log('testcase 2')
      return generateSprintWithDuration(now, args[1], 30)
    },
  },
]

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

export const createSprintFromMessage = (message, timestamp) => {
  // timestamp -> pass in Message.createdTimestamp ie 1522815707792
  const config = _.find(commands, config => {
    return parseMessageToArgs(message, config.command)
  })
  if (config) {
    const sprint = config.call(
      new Date(timestamp),
      parseMessageToArgs(message, config.command)
    )
    return sprint
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
  if (end < start) {
    end.setHours(end.getHours() + 1)
  }
  return {
    start: start,
    end: end,
  }
}
