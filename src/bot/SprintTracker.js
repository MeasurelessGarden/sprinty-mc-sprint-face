var _ = require('lodash')
import {runSprintCommand, runCancelSprintCommand, runSprintInfoCommand} from './helper.js'

const COMMANDS = { // TODO test for conflicts by running through each and verifying not-more-than-one
  RUN_SPRINT: { call: runSprintCommand },
  CANCEL_SPRINT: { call: runCancelSprintCommand},
  SPRINT_INFO: { call: runSprintInfoCommand},
}

export const RESPONSES = {
  SPRING_IS_GO : 'starting sprint'
}

export class SprintTracker {
  constructor() {
    this.cache = {}
  }

// const sprint = runSprintCommand(message, timestamp)
// if (sprint) {
//   //   // TODO if I mock out cache, client, and channel, I can move this whole block into a tested method probably
//   if (cache.timeout.end) {
//     return 'ERR_SPRINT_RUNNING_ALREADY'
//   }
//   cache.channel = channel
//   cache.timeout = sprint.timeout
//   cache.sprint = sprint.sprint
//   cache.timeout.startId = client.setTimeout(startSprint, cache.timeout.start)
//   cache.timeout.endId = client.setTimeout(endSprint, cache.timeout.end)
//   return 'OK_SPRINT_SET' // TODO need constants apparently....
// }
//
  setSprint = (sprint) => {
    this.cache.timeout = sprint.timeout
    this.cache.sprint = sprint.sprint
  }

  isSprintConfigured = () => {
    return this.cache.timeout && this.cache.timeout.end
  }

  processCommand = (message, timestamp) => {
    const matchingCommand = _.mapValues(COMMANDS, command  => {
      return command.call(message, timestamp)
    }) // TODO conflicts if more than one value is defined now
    const commandKey = _.findKey(matchingCommand, it => it )
    if(commandKey === 'RUN_SPRINT') {
      // console.log('run sprint', message, timestamp, matchingCommand[commandKey])
      if(this.isSprintConfigured()) {
        return SPRINT_RUNNING_ALREADY
      }
      this.setSprint(matchingCommand[commandKey])
      return RESPONSES.SPRING_IS_GO
    } else if (commandKey === 'CANCEL_SPRINT') {
        // console.log('cancel sprint', message, timestamp)
        if(isSprintConfigured()) {
          // clearSprint() TODO
          return CANCEL_CONFIRMED
        }
        return NO_SPRINT
    }else if (commandKey === 'SPRINT_INFO') {
        // console.log('info sprint', message, timestamp)
        if(isSprintConfigured()) {
          if(isSprintStarted()) {
            return getCurrentSprintMessage()
          }
          return getPendingSprintMessage()
        }
        return NO_SPRINT
    }
  }
  // if (runCancelSprintCommand(message, timestamp)) {
  //   if (cache.timeout.end) {
  //     client.clearTimeout(cache.timeout.startId)
  //     client.clearTimeout(cache.timeout.endId)
  //     cache.timeout = {}
  //     return 'OK_SPRINT_CANCELLED'
  //   }
  //   else return 'NO_SPRINT_TO_INFO'
  // }



  // if (runSprintInfoCommand(message, timestamp)) {
  //   const now = new Date().getTime()
  //   if (cache.timeout.end) {
  //     if (cache.start < now) {
  //       let until = cache.sprint.end - now
  //       until = `${until / 1000 / 60}`
  //       until = _.replace(until, /\..*/, '')
  //       channel.send(`There's a sprint right now, for about ${until} minutes.`)
  //     }
  //     else {
  //       let from = cache.sprint.start - now
  //       from = `${from / 1000 / 60}`
  //       from = _.replace(from, /\..*/, '')
  //       let until = cache.sprint.end - now
  //       until = `${until / 1000 / 60}`
  //       until = _.replace(until, /\..*/, '')
  //       channel.send(
  //         `There's a sprint in about ${from} minutes, something like ${until -
  //           from} minutes.`
  //       )
  //     }
  //   }
  //   else {
  //     return 'NO_SPRINT_TO_INFO'
  //   }
  // }
}
