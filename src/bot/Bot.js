var _ = require('lodash')
import {SprintTracker, RESPONSES} from './SprintTracker.js'
import {SprintChannelConfigurator} from './SprintChannelConfigurator.js'
import {run} from '../utils/commandRunner.js'

const Discord = require('discord.js') // TODO make this temporary! or something.
export class Bot {
  constructor(client) {
    this.client = client
    this.sprintTracker = new SprintTracker()
    this.sprintChannelConfigurator = new SprintChannelConfigurator()

    this.client.on('message', this.onMessage)
    this.client.on('ready', () => {
      console.log('I am ready!')
      this.sprintChannelConfigurator.loadConfiguration(
        this.client.guilds.array()
      )
    })
  }

  startSprint = () => {
    // this.sprintChannel.send(':ghost:')
    this.sprintChannelConfigurator.send(':ghost:')
    this.client.clearTimeout(this.start)
  }

  endSprint = () => {
    this.sprintChannelConfigurator.send('STOP')
    this.client.clearTimeout(this.end)
    this.sprintTracker.clearSprint()
  }

  triggerSprintCommands = (message, timestamp) => {
    const response = this.sprintTracker.processCommand(message, timestamp)

    if (response === RESPONSES.SPRINT_IS_GO) {
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
    const help = run('help', message, timestamp)
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
      const isBotAdmin = _.find(message.member.roles.array(), role => {
        const permission = new Discord.Permissions(
          message.member,
          role.permissions
        )
        // TODO try channel.permissionFor(member) to get permissions?
        return (
          permission.has(Discord.Permissions.FLAGS.ADMINISTRATOR) ||
          permission.has(Discord.Permissions.FLAGS.MANAGE_CHANNELS)
        )
      })
      if (isBotAdmin) {
        // as in, an admin of the *bot*
        const adminCommand = run(
          'admin',
          message.content,
          message.createdTimestamp
        )
        if (adminCommand === 'configure') {
          this.sprintChannelConfigurator.set(message.channel)
          message.react('👍') // '<U+1F44D>' // TODO get more emojis...
        }
        else if (adminCommand === 'show') {
          const configuredChannel = this.sprintChannelConfigurator.name()
          if (configuredChannel) {
            message.channel.send(
              `The current sprint channel is: "${configuredChannel}"`
            )
          }
          else {
            message.react('🤖')
          }
        }
      }

      if (this.sprintChannelConfigurator.isConfiguredChannel(message.channel)) {
        let result = this.triggerSprintCommands(
          message.content,
          message.createdTimestamp
        )

        if (result === RESPONSES.SPRINT_ALREADY_CONFIGURED) {
          message.react('😦')
        }
        else if (result === RESPONSES.SPRINT_IS_GO) {
          message.react('💯')
        }
        else if (result === RESPONSES.CANCEL_CONFIRMED) {
          message.react('👍')
        }
        else if (result === RESPONSES.NO_SPRINT) {
          message.react('🤖')
        }
        else if (result) {
          this.sprintChannelConfigurator.send(result)
        }
      }
    }
  }
}
