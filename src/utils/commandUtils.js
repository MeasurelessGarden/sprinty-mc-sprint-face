var _ = require('lodash')
import {sprintIntro, sprintCommands} from '../commands/sprintCommand.js' // TODO rename to sprint.js?
import {adminIntro, adminCommands} from '../commands/adminCommand.js'
import {countIntro, countCommands} from '../commands/countCommand.js'

// TODO rename this util to something to do with help command util.... idk...

const COMMAND_LOOKUP = {
  sprint: {intro: sprintIntro, commands: sprintCommands},
  admin: {intro: adminIntro, commands: adminCommands},
  count: {intro: countIntro, commands: countCommands},
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
