var _ = require('lodash')
import {
  runSprintCommand,
  runCancelSprintCommand,
  runSprintInfoCommand,
} from './helper.js'

const COMMANDS = {
  // TODO test for conflicts by running through each and verifying not-more-than-one
  RUN_SPRINT: {call: runSprintCommand},
  CANCEL_SPRINT: {call: runCancelSprintCommand},
  SPRINT_INFO: {call: runSprintInfoCommand},
}

export const RESPONSES = {
  SPRING_IS_GO: 'starting sprint',
  SPRINT_ALREADY_CONFIGURED: 'sprint already configured',
  CANCEL_CONFIRMED: 'cancel sprint confirmed',
  NO_SPRINT: 'no sprint configured to manage',
}

export class SprintTracker {
  constructor() {
    this.cache = {}
  }

  setSprint = sprint => {
    this.cache.timeout = sprint.timeout
    this.cache.sprint = sprint.sprint
  }

  isSprintConfigured = () => {
    return this.cache.timeout && this.cache.timeout.end
  }

  processCommand = (message, timestamp) => {
    const matchingCommand = _.mapValues(COMMANDS, command => {
      return command.call(message, timestamp)
    }) // TODO conflicts if more than one value is defined now
    const commandKey = _.findKey(matchingCommand, it => it)

    if (commandKey === 'RUN_SPRINT') {
      if (this.isSprintConfigured()) {
        return RESPONSES.SPRINT_ALREADY_CONFIGURED
      }
      this.setSprint(matchingCommand[commandKey])
      return RESPONSES.SPRING_IS_GO
      // TODO sprint tracker doesn't have access to client to set timeouts
      //   cache.timeout.startId = client.setTimeout(startSprint, cache.timeout.start)
      //   cache.timeout.endId = client.setTimeout(endSprint, cache.timeout.end)
    }
    else if (commandKey === 'CANCEL_SPRINT') {
      // console.log('cancel sprint', message, timestamp)
      if (this.isSprintConfigured()) {
        // clearSprint() TODO
        return RESPONSES.CANCEL_CONFIRMED
      }
      return RESPONSES.NO_SPRINT
    }
    else if (commandKey === 'SPRINT_INFO') {
      // console.log('info sprint', message, timestamp)
      if (this.isSprintConfigured()) {
        if (this.isSprintStarted(timestamp)) {
          return this.getCurrentSprintMessage(timestamp)
        }
        return this.getPendingSprintMessage(timestamp)
      }
      return RESPONSES.NO_SPRINT
    }
  }

  isSprintStarted = timestamp => {
    return this.cache.sprint.start < timestamp // TODO assumes it doesn't need to check end-time, because sprint cache will be cleared
  }

  formatClockString = datetime => {
    const minutes = datetime.getMinutes()
    const seconds = datetime.getSeconds()
    // TODO I know there's a better way to format numbers as strings with padding.... but this works
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10
      ? '0' + seconds
      : seconds}`
  }

  getCurrentSprintMessage = timestamp => {
    const until = new Date(this.cache.sprint.end - timestamp)
    return `Currently running a sprint. ${this.formatClockString(
      until
    )} remaining.`
  }

  getPendingSprintMessage = timestamp => {
    const from = new Date(this.cache.sprint.start - timestamp)
    const until = new Date(this.cache.sprint.end - timestamp)
    return `There's a sprint from ${this.formatClockString(
      from
    )} until ${this.formatClockString(until)}.`
  }
}
