import {createObjFromMessage} from '../utils/parseUtils.js'
import {sprintCommands} from '../commands/sprintCommand.js' // TODO rename to sprint.js?
import {helpCommands} from '../commands/helpCommand.js'

export const runSprintCommand = (message, timestamp) => {
  const sprint = createObjFromMessage(sprintCommands, message, timestamp)
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
  }}

}
