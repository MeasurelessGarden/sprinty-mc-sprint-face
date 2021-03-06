var _ = require('lodash')
import {SprintTracker, RESPONSES} from './SprintTracker.js'
import {SprintRunner} from './SprintRunner.js'
import {CountTracker} from './CountTracker.js'
import {SprintChannelConfigurator} from './SprintChannelConfigurator.js'
import {runHelp, runAdmin} from '../utils/parseUtils.js'

const Discord = require('discord.js') // TODO make this temporary! or something.
export class Bot {
  constructor(client, guildDb) {
    this.client = client
    this.guildDb = guildDb
    this.countTracker = new CountTracker()
    this.guildChannels = {}

    this.client.on('message', this.onMessage)
    this.client.on('ready', () => {
      console.log('I am ready!')

      _.each(this.client.guilds.array(), guild => {
        const configurator = new SprintChannelConfigurator(
          this.guildDb,
          guild.id
        )
        const tracker = new SprintTracker()
        const sprintManager = {
          configurator: configurator,
          tracker: tracker,
          runner: new SprintRunner(this.client, tracker, configurator),
        }
        this.guildChannels[guild.id] = sprintManager
        sprintManager.configurator.loadConfiguration(guild.channels.array())
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

  triggerCountCommands = (user, message, timestamp) => {
    return this.countTracker.processCommand(user, message, timestamp)
  }

  triggerSprintCommands = (message, timestamp, guildId) => {
    const response = this.guildChannels[guildId].tracker.processCommand(
      message,
      timestamp
    )

    if (response === RESPONSES.SPRINT_IS_GO) {
      this.guildChannels[guildId].runner.start()
    }
    else if (response === RESPONSES.CANCEL_CONFIRMED) {
      this.guildChannels[guildId].runner.clear()
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
          this.guildChannels[message.channel.guild.id].configurator.set(
            message.channel,
            message.createdTimestamp
          )
          message.react('👍')
        }
        else if (adminCommand === 'show') {
          const configuredChannel = this.guildChannels[
            message.channel.guild.id
          ].configurator.name()
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

      if (
        this.guildChannels[
          message.channel.guild.id
        ].configurator.isConfiguredChannel(message.channel)
      ) {
        let result = this.triggerSprintCommands(
          message.content,
          message.createdTimestamp,
          message.guild.id
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
          this.guildChannels[message.channel.guild.id].configurator.send(result)
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
