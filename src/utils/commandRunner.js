import {createObjFromMessage} from './parseUtils.js'
import {sprintCommands} from '../commands/sprintCommand.js'
import {adminCommands} from '../commands/adminCommand.js'
import {helpCommands} from '../commands/helpCommand.js'

const COMMAND_LOOKUP = {
  sprint: {commands: sprintCommands},
  admin: {commands: adminCommands},
  help: {commands: helpCommands},
}

export const run = (commandName, message, timestamp) => {
  const command = COMMAND_LOOKUP[commandName]
  return createObjFromMessage(command.commands, message, timestamp)
}