import {Bot} from './bot/Bot.js'
const Discord = require('discord.js')
var auth = require('./secret.json')

const bot = new Bot(new Discord.Client())

const triggerHelpCommands = (message, timestamp, channel) => {
  if (channel) {
    const help = createObjFromMessage(helpCommands, message, timestamp)
    if (help) {
      if (_.split(help, '\n').length > 40) {
        // TODO maybe just have help return arrays instead of joining \n\n just to split it again here? then the helper function can make an array of blocks to send
        // can't send ultra-long messages
        const blocks = _.split(help, '\n\n')
        let block = _.take(blocks, 4)
        channel.send(_.join(block, '\n\n'))
        let working = _.slice(blocks, 4) //_.xorWith(blocks, block, _.isEqual)//_.without(blocks, block)
        while (working.length > 0) {
          block = _.take(working, 4)
          channel.send(_.join(block, '\n\n'))
          working = _.slice(working, 4) //_.without(working, block)
        }
      }
      else {
        channel.send(help)
      }
    }
  }
}

bot.client.login(auth.token)
