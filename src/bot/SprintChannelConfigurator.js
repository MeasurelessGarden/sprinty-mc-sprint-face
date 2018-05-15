var _ = require('lodash')
import {runAdmin} from '../utils/parseUtils.js'

export class SprintChannelConfigurator {
  constructor(guildDb, guildId) {
    this.channelInit = []
    this.guildDb = guildDb
    this.guildId = guildId
  }

  send = message => {
    if (this.channel) {
      this.channel.send(message)
    }
  }

  set = (channel, when, saveToDb = true) => {
    this.channel = channel
    this.when = when
    if (saveToDb) {
      this.guildDb.configureSprintChannel(channel.guild.id, channel.id, when)
    }
  };

  name = () => {
    if (this.channel) {
      return this.channel.name
    }
  }

  isConfiguredChannel = channel => {
    if (this.channel) {
      return this.channel.id === channel.id
    }
  }

  areAllChannelPinsLoaded = () => {
    const incomplete = _.filter(this.channelInit, channel => {
      return !_.has(channel, 'pinnedMessages')
    })
    // console.log('incomplete returns?', _.map(incomplete, init=>init.channel.name))
    console.log('loading pinned messages', this.guildId, incomplete.length)
    //TODO why am I getting triplicate messages: "loading pinned messages XYZ 0"????
    return incomplete.length === 0
  }

  loadConfigurationFromPinnedCommands = () => {
    const commands = _.filter(
      _.flatMap(this.channelInit, channel => {
        return _.map(channel.pinnedMessages, pin => {
          const command = runAdmin(pin.content)
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
      if (this.channel) {
        if (lastConfig.timestamp > this.when) {
          console.log(
            'pinned message newer than database!',
            lastConfig.channel.guild.id,
            lastConfig.channel.id,
            lastConfig.timestamp,
            'db:',
            this.channel,
            this.when
          )
          this.set(lastConfig.channel, lastConfig.timestamp)
        }
      }
      else {
        console.log(
          'nothing loaded from database',
          lastConfig.channel.guild.id,
          lastConfig.channel.id,
          lastConfig.timestamp
        )
        this.set(lastConfig.channel, lastConfig.timestamp)
      }
    }
  }

  fetchPinned = (initifiedChannel, callback) => {
    initifiedChannel.channel
      .fetchPinnedMessages({limit: 2})
      .then(messages => {
        initifiedChannel.pinnedMessages = messages.array()
        callback()
      })
      .catch(error => {
        console.error(error)
        initifiedChannel.pinnedMessages = []
        callback()
      })
  }

  initChannelStart = channel => {
    const callback = () => {
      if (this.areAllChannelPinsLoaded()) {
        this.loadConfigurationFromPinnedCommands()
      }
    }
    if (channel.type == 'text') {
      const initifiedChannel = {channel: channel}
      this.channelInit.push(initifiedChannel)
      this.fetchPinned(initifiedChannel, callback)
    }
  }

  loadConfiguration = channels => {
    this.guildDb.readConfiguredSprintChannel(this.guildId, result => {
      if (result.rowCount === 1) {
        const channelId = _.head(result.rows).sprint_channel_id
        const channelWhen = _.head(result.rows).sprint_channel_date
        console.log(
          'guild channel saved as ',
          this.guildId,
          channelId,
          channelWhen
        )
        this.set(
          _.find(channels, channel => {
            return channel.id === channelId
          }),
          channelWhen,
          false
        )
      }
    })

    const callback = () => {
      if (this.areAllChannelPinsLoaded()) {
        this.loadConfigurationFromPinnedCommands()
      }
    }
    _.each(channels, channel => {
      this.initChannelStart(channel)
    })
    _.each(this.channelInit, channel => {
      channel.channel
        .fetchPinnedMessages({limit: 2})
        .then(messages => {
          channel.pinnedMessages = messages.array()
          callback()
        })
        .catch(error => {
          if (error.message === 'Missing Access') {
            console.error('Missing Access for ', error.path)
          }
          else {
            console.error(error)
          }
          channel.pinnedMessages = []
          callback()
        })
    })
  }
}
