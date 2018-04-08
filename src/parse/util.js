var _ = require('lodash')

// this one has to do with *raw user messages*
export const preparseMessage = message => {
  // message, a string typed by a user (assumes no @USERNAME)
  return _.toLower(
    _.trim(_.replace(_.replace(message, /[^\w]/g, ' '), /\s\s*/g, ' '))
  )
}

// this is part of the command itself! or at least - how I structure commands TODO ... no I just need a consistent set of terms. command in this context is different than in another...
export const parse = (message, command) => {
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

export const convertFunctionArgs = (message, command) => {
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
  let m = parse(preparseMessage(message), command)
  if (m.length == command.length) {
    let args = convertFunctionArgs(m, command)
    return args
  }
}
