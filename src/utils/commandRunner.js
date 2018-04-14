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
