import {createObjFromMessage} from '../utils/parseUtils.js'
import {sprintCommands} from '../commands/sprintCommand.js' // TODO rename to sprint.js?
import {helpCommands} from '../commands/helpCommand.js'

// TODO rename to commandRunner?

export const runHelpCommand = (message, timestamp) => {
  return createObjFromMessage(helpCommands, message, timestamp)
}

export const runSprintCommand = (message, timestamp) => {
  const sprint = createObjFromMessage(sprintCommands, message, timestamp)
  if (sprint === 'cancel' || sprint === 'info') {
    return sprint
  }
  if (sprint) {
    const start = sprint.start.getTime()
    const end = sprint.end.getTime()

    return {
      sprint: {
        start: start,
        end: end,
      },
      timeout: {
        start: start - timestamp,
        end: end - timestamp,
      },
    }
  }
}
