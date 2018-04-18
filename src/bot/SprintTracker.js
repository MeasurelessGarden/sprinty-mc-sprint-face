var _ = require('lodash')
import {runSprint} from '../utils/parseUtils.js'

export const RESPONSES = {
  SPRINT_IS_GO: 'starting sprint',
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

  getStartTimeout = () => {
    return this.cache.timeout.start
  }

  getEndTimeout = () => {
    return this.cache.timeout.end
  }

  isSprintConfigured = () => {
    return this.cache.timeout && this.cache.timeout.end
  }

  processCommand = (message, timestamp) => {
    const command = runSprint(message, timestamp)
    if (command === 'cancel') {
      if (this.isSprintConfigured()) {
        return RESPONSES.CANCEL_CONFIRMED
      }
      return RESPONSES.NO_SPRINT
    }
    else if (command === 'info') {
      if (this.isSprintConfigured()) {
        if (this.isSprintStarted(timestamp)) {
          return this.getCurrentSprintMessage(timestamp)
        }
        return this.getPendingSprintMessage(timestamp)
      }
      return RESPONSES.NO_SPRINT
    }
    else if (command) {
      if (this.isSprintConfigured()) {
        return RESPONSES.SPRINT_ALREADY_CONFIGURED
      }
      this.setSprint(command)
      return RESPONSES.SPRINT_IS_GO
    }
  }

  isSprintStarted = timestamp => {
    return this.cache.sprint.start < timestamp // TODO assumes it doesn't need to check end-time, because sprint cache will be cleared
  }

  formatClockString = datetime => {
    const minutes = datetime.getMinutes()
    // TODO I know there's a better way to format numbers as strings with padding.... but this works
    // return `${minutes < 10 ? '0' + minutes : minutes} min ${seconds < 10
    //   ? '0' + seconds
    //   : seconds} sec`
    return `:${minutes < 10 ? '0' + minutes : minutes}`
  }

  formatTimeRemainingString = datetime => {
    const minutes = datetime.getMinutes()
    const seconds = datetime.getSeconds()
    return `${minutes} min ${seconds} sec`
  }

  getCurrentSprintMessage = timestamp => {
    const left = this.formatTimeRemainingString(
      new Date(this.cache.sprint.end - timestamp)
    )
    return `Currently running a sprint. ${left} remaining.`
  }

  getPendingSprintMessage = timestamp => {
    const from = this.formatClockString(new Date(this.cache.sprint.start))
    const until = this.formatClockString(new Date(this.cache.sprint.end))
    const remaining = this.formatTimeRemainingString(
      new Date(this.cache.sprint.start - timestamp)
    )
    return `There's a sprint from ${from} until ${until} (starts in ${remaining}).`
  }

  clearSprint = () => {
    this.cache = {}
  }
}
