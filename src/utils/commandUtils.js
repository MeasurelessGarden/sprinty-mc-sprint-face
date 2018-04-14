var _ = require('lodash')
import {sprintIntro, sprintCommands} from '../commands/sprintCommand.js' // TODO rename to sprint.js?
import {adminIntro, adminCommands} from '../commands/adminCommand.js'

const COMMAND_LOOKUP = {
  sprint: {intro: sprintIntro, commands: sprintCommands},
  admin: {intro: adminIntro, commands: adminCommands},
}

export const isValidCommandName = arg => {
  if (COMMAND_LOOKUP[arg]) {
    return true
  }
  return false
}

export const validCommandsString = _.join(_.keys(COMMAND_LOOKUP).sort(), ', ')

export const generate = (commandName, generateFunction) => {
  const command = COMMAND_LOOKUP[commandName]
  return generateFunction(commandName, command.intro, command.commands)
}
