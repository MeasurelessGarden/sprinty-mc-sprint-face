var _ = require('lodash')
import {run} from '../utils/commandRunner.js'

export class SprintChannelConfigurator {
  constructor() {
    this.channel
  }

  send = message => {
    if (this.channel) {
      this.channel.send(message)
    }
  }

  set = channel => {
    this.channel = channel
  };

  name = () => {
    if (this.channel) {
      // TODO this is the kind of thing that's really insecure if I end up wanting this bot working for multiple actual servers
      return this.channel.name
    }
  }

  isConfiguredChannel = channel => {
    if (this.channel) {
      return this.channel.id === channel.id
    }
  }

  loadConfiguration = guilds => {
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
              const command = run('admin', pin.content, pin.createdTimestamp)
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
        const lastConfig = _.head(_.sortBy(commands, [ 'timestamp' ]).reverse())
        if (lastConfig) {
          this.set(lastConfig.channel)
          this.send('Sprint channel is up and being monitored again.')
        }
        _.find(channelInit, channel => {
          return (
            channel.channel.name == 'sprinty_test' ||
            channel.channel.name == 'sprinty_test2'
          )
        }).channel.send('I have found all my configuration!') // TODO unfortunately, these messages make very little sense, bc the bot can't easily know which channel they really belong in
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
          // TODO unfortunately, these messages make very little sense, bc the bot can't easily know which channel they really belong in
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
  }
}
