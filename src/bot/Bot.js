var _ = require('lodash')
import {SprintTracker, RESPONSES} from './SprintTracker.js'
import {CountTracker} from './CountTracker.js'
import {SprintChannelConfigurator} from './SprintChannelConfigurator.js'
import {runHelp, runAdmin} from '../utils/parseUtils.js'

const Discord = require('discord.js') // TODO make this temporary! or something.
export class Bot {
  constructor(client, guildDb) {
    this.client = client
    this.guildDb = guildDb
    this.sprintTracker = new SprintTracker()
    this.countTracker = new CountTracker()
    this.sprintChannelConfigurator = new SprintChannelConfigurator()

    this.client.on('message', this.onMessage)
    this.client.on('ready', () => {
      console.log('I am ready!')
      this.sprintChannelConfigurator.loadConfiguration(
        this.client.guilds.array()
      )
      _.each(this.client.guilds.array(), guild => {
        this.guildDb.readConfiguredSprintChannel(guild.id, result => {
          console.log('guild read config', guild.id, result)
        })
      })
    })
    this.client.on('error', err => {
      console.error('ERROR', err)
    })
    this.client.on('warn', info => {
      console.warn('WARN', info)
    })
    // this.client.on('debug', info => {
    //   this is too noisy to keep on by default
    //   console.log('DEBUG', info)
    // })
    this.client.on('disconnect', event => {
      console.log('disconnected', event.code, event.reason)
    })
    this.client.on('guildUnavailable', guild => {
      console.log('unable to access guild', guild.id, guild.name)
    })
    this.client.on('reconnecting', () => {
      this.console.log('reconnecting')
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

  triggerCountCommands = (user, message, timestamp) => {
    return this.countTracker.processCommand(user, message, timestamp)
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

  triggerHelpCommands = message => {
    const help = runHelp(message)
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
    //     return userMention.id == auth.clientId // TODO use env also?
    //   })

    if (message.channel.type == 'dm') {
      const helpMessages = this.triggerHelpCommands(message.content)
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
        const adminCommand = runAdmin(message.content)
        if (adminCommand === 'configure') {
          this.sprintChannelConfigurator.set(message.channel)
          this.guildDb.configureSprintChannel(
            message.channel.guild.id,
            message.channel.id,
            message.createdTimestamp
          )
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

        result = this.triggerCountCommands(
          message.author,
          message.content,
          message.createdTimestamp
        )

        if (result) {
          message.react('👍')
          message.author.send(result)
        }
      }
    }
  }
}
