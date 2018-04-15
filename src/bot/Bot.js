var _ = require('lodash')
import {SprintTracker, RESPONSES} from './SprintTracker.js'
import {run} from '../utils/commandRunner.js'

const Discord = require('discord.js') // TODO make this temporary! or something.
export class Bot {
  constructor(client) {
    this.client = client
    this.sprintTracker = new SprintTracker()

    this.client.on('message', this.onMessage)
    this.client.on('ready', () => {
      console.log('I am ready!')
      // console.log('guilds:', this.client.guilds)
      const guilds = this.client.guilds.array()
      // _.each(guilds, guild=> {
      //   _.each(guild.channels.array(), channel=>{
      //     if(channel.type =='text') {
      //       channel.fetchPinnedMessages({limit: 2})
      //       .then(messages =>
      //         {
      //           if(messages.length == 0 ) {console.log('no pins')}
      //           _.each(messages.array(), message=> {console.log('pin',message.content)})
      //         }
      //       )
      //       .catch(console.error)
      //     }
      //   })
      // })
      ///
      const channelInit = []
      const callback = () => {
        const incomplete = _.filter(channelInit, channel => {
          return !_.has(channel, 'pinnedMessages')
        })
        // console.log('incomplete returns?', _.map(incomplete, init=>init.channel.name))
        console.log('loading pinned messages', incomplete.length)
        if (incomplete.length == 0) {
          const commands = _.filter(
            _.flatMap(channelInit, channel => {
              return _.map(channel.pinnedMessages, pin => {
                console.log(
                  '????',
                  pin.content,
                  pin.createdTimestamp,
                  this.triggerAdminCommands(pin.content, pin.createdTimestamp)
                )
                const command = this.triggerAdminCommands(
                  pin.content,
                  pin.createdTimestamp
                )
                if (command) {
                  return {
                    channel: pin.channel,
                    message: pin.content,
                    timestamp: pin.createdTimestamp,
                    adminCommand: command,
                  }
                }
              })
            }),
            it => it
          )
          console.log('pinned commands?', commands)
          const lastConfig = _.head(
            _.sortBy(commands, [ 'timestamp' ]).reverse()
          ) // TODO test this with more pins
          if (lastConfig) {
            console.log('whaaaaa?', lastConfig)
            this.sprintChannel = lastConfig.channel
            this.sprintChannel.send(
              'Sprint channel is up and being monitored again.'
            )
          }
          _.find(channelInit, channel => {
            return (
              channel.channel.name == 'sprinty_test' ||
              channel.channel.name == 'sprinty_test2'
            )
          }).channel.send('I have found all my configuration!')
        }
      }
      const channels = _.each(guilds, guild => {
        _.each(guild.channels.array(), channel => {
          if (
            channel.type == 'text' &&
            (channel.name == 'sprinty_test' || channel.name == 'sprinty_test2')
          ) {
            channelInit.push({channel: channel})
          }
        })
      })
      _.each(channelInit, channel => {
        if (
          channel.channel.name == 'sprinty_test' ||
          channel.channel.name == 'sprinty_test2'
        ) {
          channel.channel.send(
            "I'm online again! Please be patient while I fully load..."
          )

          // TODO fetch pinned only for this test channel just the moment... it's so slow
          channel.channel
            .fetchPinnedMessages({limit: 2})
            .then(messages => {
              channel.pinnedMessages = messages.array()
              callback()
            })
            .catch(error => {
              console.error(error)
              channel.pinnedMessages = []
              callback()
            })
        }
      })
    })
  }

  startSprint = () => {
    this.sprintChannel.send(':ghost:')
    this.client.clearTimeout(this.start)
  }

  endSprint = () => {
    this.sprintChannel.send('STOP')
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

  triggerAdminCommands = (message, timestamp) => {
    const admin = run('admin', message, timestamp)
    if (admin) {
      // TODO assumes all admin commands are the same thing (which is true.... for now)
      return admin
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
        const adminCommand = this.triggerAdminCommands(
          message.content,
          message.createdTimestamp
        )
        if (adminCommand === 'configure') {
          this.sprintChannel = message.channel
          message.react('👍') // '<U+1F44D>' // TODO get more emojis...
        }
        else if (adminCommand === 'show') {
          if (this.sprintChannel) {
            message.channel.send(
              `The current sprint channel is: "${this.sprintChannel.name}"`
            )
          }
          else {
            message.react('🤖')
          }
        }
      }

      if (message.channel == this.sprintChannel) {
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
          this.sprintChannel.send(result)
        }
      }
    }
  }
}
