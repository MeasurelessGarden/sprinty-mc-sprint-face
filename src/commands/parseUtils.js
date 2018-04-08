var _ = require('lodash')

// this one has to do with *raw user messages*
export const preparseMessage = message => {
  // message, a string typed by a user (assumes no @USERNAME)
  return _.toLower(
    _.trim(_.replace(_.replace(message, /[^\w]/g, ' '), /\s\s*/g, ' '))
  )
}

// this is part of the command itself! or at least - how I structure commands TODO ... no I just need a consistent set of terms. command in this context is different than in another...
export const parseMessageToArray = (message, command) => {
  // assumes message is cleaned by preparse first
  // command, an array to match terms from to identify command and args
  const parseArgsEquality = (value, arg) => {
    if (_.isEqual(arg, 'Number')) {
      return Number(value) >= 0 // TODO note that the removal of punctuation means negative numbers cannot happen anyway
    }
    return _.isEqual(value, arg)
  }
  const matchingValues = []
  let workingMessage = _.split(message, ' ')
  const partsOfMatchingCommand = _.takeWhile(command, function(param){
    if (workingMessage.length == 0) return false

    const result = _.intersectionWith(
      workingMessage,
      [ param ],
      parseArgsEquality
    )
    if (result && result.length > 0) {
      const index = _.indexOf(workingMessage, result[0])
      matchingValues.push(workingMessage[index])
      workingMessage = _.takeRight(
        workingMessage,
        workingMessage.length - index
      )
    }
    return result && result.length > 0
  })
  return matchingValues
}

export const convertFunctionArgsToNumbers = (message, command) => {
  // TODO this could actually move to a later step, based on validating the command template...
  // message, array from parse(...)
  // command, array of command
  // TODO test / verify assumption - these args *must* be the same length...
  return _.map(message, (m, index) => {
    if (_.isEqual(command[index], 'Number')) {
      return Number(m)
    }
    return m
  })
}

export const parseMessageToArgs = (message, command) => {
  // puts preparse, parse, and convertFunctionArgs together
  let m = parseMessageToArray(preparseMessage(message), command)
  if (m.length == command.length) {
    let args = convertFunctionArgsToNumbers(m, command)
    return args
  }
}

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
