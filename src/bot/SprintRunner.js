var _ = require('lodash')
import {runSprint} from '../utils/parseUtils.js'

export class SprintRunner {
  constructor(client, tracker, configurator) {
    this.client = client
    this.tracker = tracker
    this.configurator = configurator
  }

  start = () => {
    this.start = this.client.setTimeout(
      this.startSprint,
      this.tracker.getStartTimeout()
    )
    this.end = this.client.setTimeout(
      this.endSprint,
      this.tracker.getEndTimeout()
    )
  }

  clear = () => {
    this.client.clearTimeout(this.start)
    this.client.clearTimeout(this.end)
    this.tracker.clearSprint()
  }

  startSprint = () => {
    this.configurator.send(':ghost:')
    this.client.clearTimeout(this.start)
  }

  endSprint = () => {
    this.configurator.send('STOP')
    this.client.clearTimeout(this.end)
    this.tracker.clearSprint()
  }
}
