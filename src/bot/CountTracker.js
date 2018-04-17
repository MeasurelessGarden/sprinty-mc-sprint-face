var _ = require('lodash')
import {run} from '../utils/commandRunner.js'

export class CountTracker {
  constructor() {
    this.cache = {}
  }

  processCommand = (user, message, timestamp) => {
    const command = run('count', message, timestamp)
    if (command) {
      if (command.set) {
        const message = this.countChangeMessage(
          this.getCount(user),
          command.set,
          command.type
        )
        this.set(user, command.set, command.type)
        return message
      }
      // if command.add ....
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

  countChangeMessage = (prevCount, nextCount, type) => {
    if (prevCount) {
      return `Count updated to ${nextCount} (was ${prevCount}) (${nextCount -
        prevCount}Δ)`
    }
    return `You have ${nextCount} ${type}s. You know it. I know it.`
  }
}
