var _ = require('lodash')

export const preparseMessage = message => {
  return _.toLower(
    _.trim(_.replace(_.replace(message, /[^\w]/g, ' '), /\s\s*/g, ' '))
  )
}

export const parse = (message, command, args) => {
  // assumes message is cleaned by preparse first
  const parseArgsEquality = (value, arg) => {
    if (_.isEqual(arg, 'Number')) {
      return Number(value) >= 0 // TODO note that the removal of punctuation means negative numbers cannot happen anyway
    }
    return _.isEqual(value, arg)
  }
  const matchingValues = []
  let workingMessage = _.split(message, ' ')
  const partsOfMatchingCommand = _.takeWhile(
    _.concat([ command ], args),
    function(param){
      if (workingMessage.length == 0) return false

      const result = _.intersectionWith(
        workingMessage,
        [ param ],
        parseArgsEquality
      )
      if (result) {
        const index = _.indexOf(workingMessage, result[0])
        matchingValues.push(workingMessage[index])
        workingMessage = _.takeRight(
          workingMessage,
          workingMessage.length - index
        )
      }
      return result
    }
  )
  return matchingValues
}

export const convertFunctionArgs = (message, fullCommand) => {
  return _.map(message, (m, index) => {
    if (_.isEqual(fullCommand[index], 'Number')) {
      return Number(m)
    }
    return m
  })
}
