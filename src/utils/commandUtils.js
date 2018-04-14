var _ = require('lodash')

import {sprintIntro, sprintCommands} from '../commands/sprintCommand.js'
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

export const lookupCommand = arg => {
  return COMMAND_LOOKUP[arg]
}
