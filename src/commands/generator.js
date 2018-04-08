var _ = require('lodash')
import {parseMessageToArgs} from '../parse/util'
// import {
//   generateSprintWithEndTime,
//   generateSprintWithDuration,
// } from './timeUtils.js'
// import {sprintCommands}  from './sprintCommand'
// export const help =
//   'There are a lot of ways to start a sprint! Other sprint commands you might care about are "cancel" and "info".'

// TODO I should probably put testing around this function directly...
const parseCommandArgs = (vocabulary, messageArgs, templateInputs) => {
  return _.difference(messageArgs, vocabulary)
  // TODO, somehow use templateInputs to fill in defaults!
}

// TODO I should probably put testing around this function directly...
const validate = (templateInputs, commandArgs) => {
  if (templateInputs.length == commandArgs.length) {
    const invalid = _.find(templateInputs, (input, index) => {
      // find the first input that fails a check
      // TODO assumes that the command parsing has already covered the type must be Number thing...
      const checks = _.find(input.checks, check => {
        // find the first check that fails
        return !check(commandArgs[index])
      })
      return !!checks
    })
    return !!!invalid
  }
  return false
}

export const createObjFromMessage = (commands, message, timestamp) => {
  // message, (string) content of the message
  // timestamp -> pass in Message.createdTimestamp ie 1522815707792
  const config = _.find(commands, config => {
    return parseMessageToArgs(message, config.vocabulary) // TODO how to prevent running this twice? do I care? it bugs me, but it's probably fine
  })
  if (config) {
    const commandArgs = parseCommandArgs(
      config.vocabulary,
      parseMessageToArgs(message, config.vocabulary),
      config.template.input
    )
    if (validate(config.template.input, commandArgs)) {
      const functionArgs = _.concat([ timestamp ], commandArgs)
      const obj = config.template.call(...functionArgs)
      return obj
    }
  }
}
