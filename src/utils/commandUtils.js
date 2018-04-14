var _ = require('lodash')
import {createObjFromMessage} from './parseUtils.js'

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

// export const help = commandName => {
//   return generateHelp(command.intro, command.commands)
// }
//
// export const examples = commandName => {
//   const command = COMMAND_LOOKUP[commandName]
//   return generateExamples(commandName, command.commands)
// }

// export const runHelpCommand = (message, timestamp) => {
//   return createObjFromMessage(helpCommands, message, timestamp)
// }
//
// export const runSprintCommand = (message, timestamp) => {
//   const sprint = createObjFromMessage(sprintCommands, message, timestamp)
//   if (sprint === 'cancel' || sprint === 'info') {
//     return sprint
//   }
//   if (sprint) {
//     const start = sprint.start.getTime()
//     const end = sprint.end.getTime()
//
//     return {
//       sprint: {
//         start: start,
//         end: end,
//       },
//       timeout: {
//         start: start - timestamp,
//         end: end - timestamp,
//       },
//     }
//   }
// }
