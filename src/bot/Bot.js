var _ = require('lodash')
import {SprintTracker, RESPONSES} from './SprintTracker.js'
import {runHelpCommand} from './helper.js'

export class Bot {
  constructor(client) {
    this.client = client
    this.sprintTracker = new SprintTracker()

    this.client.on('message', this.onMessage)
    this.client.on('ready', () => {
      console.log('I am ready!')
    })
  }

  startSprint = () => {
    this.channel.send(':ghost:')
    this.client.clearTimeout(this.start)
  }

  endSprint = () => {
    this.channel.send('STOP')
    this.client.clearTimeout(this.end)
    this.sprintTracker.clearSprint()
  }

  triggerSprintCommands = (message, timestamp) => {
    const response = this.sprintTracker.processCommand(message, timestamp)

    if (response === RESPONSES.SPRING_IS_GO) {
      this.start = this.client.setTimeout(
        this.startSprint,
        this.sprintTracker.getStartTimeout()
      )
      this.end = this.client.setTimeout(
        this.endSprint,
        this.sprintTracker.getEndTimeout()
      )
    }
    else if (response === RESPONSES.CANCEL_CONFIRMED) {
      this.client.clearTimeout(this.start)
      this.client.clearTimeout(this.end)
      this.sprintTracker.clearSprint()
    }
    return response
  }

  triggerHelpCommands = (message, timestamp) => {
    const help = runHelpCommand(message, timestamp)
    if (help) {
      const messages = []
      let block = _.take(help, 4)
      let working = _.slice(help, 4)
      messages.push(_.join(block, '\n\n'))
      while (working.length > 0) {
        block = _.take(working, 4)
        messages.push(_.join(block, '\n\n'))
        working = _.slice(working, 4)
      }
      return messages
    }
  }

  onMessage = message => {
    // console.log(message)
    if (message.author.bot) {
      return
    } // prevent botception

    if (message.content.includes('\n')) {
      // ignore multiline messages, they are definitely not commands
      return
    }
    if (_.words(message.content).length > 15) {
      // ignore long messages, they are probably not commands
      return
    }

    // TODO mentions @ Sprinty
    //   _.find(message.mentions.users.array(), userMention => {
    //     return userMention.id == auth.clientId
    //   })

    if (message.channel.type == 'dm') {
      const helpMessages = this.triggerHelpCommands(
        message.content,
        message.createdTimestamp
      )
      _.each(helpMessages, helpMessage => {
        message.channel.send(helpMessage)
      })
    }
    else {
      let result = this.triggerSprintCommands(
        message.content,
        message.createdTimestamp
      )

      if (result === RESPONSES.SPRINT_ALREADY_CONFIGURED) {
        message.react('😦')
      }
      else if (result === RESPONSES.SPRING_IS_GO) {
        this.channel = message.channel // TODO until it's configurable
        message.react('💯')
      }
      else if (result === RESPONSES.CANCEL_CONFIRMED) {
        message.react('👍')
      }
      else if (result === RESPONSES.NO_SPRINT) {
        message.react('🤖')
      }
      else if (result) {
        message.channel.send(result)
      }
    }
  }
}
