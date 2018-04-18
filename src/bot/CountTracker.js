var _ = require('lodash')
import {runCount} from '../utils/parseUtils.js'

export class CountTracker {
  constructor() {
    this.cache = {}
  }

  processCommand = (user, message) => {
    const command = runCount(message, this.getCount(user))
    if (command) {
      if (command.delta) {
        // indicator it was an add not a set
        const message = this.countChangeMessage(
          command.count,
          command.delta,
          command.type
        )
        this.set(user, command.count, command.type)
        return message
      }
      else if (command) {
        const message = this.countSetMessage(command.count, command.type)
        this.set(user, command.count, command.type)
        return message
      }
    }
  }

  getCount = user => {
    if (this.cache[user]) {
      return this.cache[user].count
    }
  }

  set = (user, count, type) => {
    if (!this.cache[user]) {
      this.cache[user] = {}
    }
    this.cache[user].count = count
    this.cache[user].type = type
  };

  countChangeMessage = (count, delta, type) => {
    return `You have ${delta} new ${type}s. (Now at ${count}.)`
  }

  countSetMessage = (nextCount, type) => {
    return `You have ${nextCount} ${type}s. You know it. I know it.`
  }
}
