var _ = require('lodash')

import {combinations} from './combine.js'

export const substituteVocabularyArgNames = commandConfig => {
  const help = _.clone(commandConfig.vocabulary)
  _.each(commandConfig.template.input, input => {
    const name = _.toUpper(input.name) // TODO formatting: bold name with **?
    // sub Number in vocab as a side effect
    const vocabSub = [ `[${name}]` ]
    const index = _.indexOf(help, input.type, _.isEqual)
    _.fill(help, vocabSub, index, index + 1)
  })
  return _.map(combinations(help), h => _.join(h, ' '))
}

export const substituteInputParamsForHelp = command => {
  // TODO rename command commandConfig?
  const inputDesc = _.map(command.template.input, input => {
    const name = _.toUpper(input.name) // TODO formatting: bold name with **?
    const units = input.units ? `(${input.units})` : ''
    return _.join(
      _.filter([ name, units, '-', input.description ], it => it),
      ' '
    )
  })
  return _.concat(
    substituteVocabularyArgNames(command).join('\n'),
    inputDesc,
    command.template.additionalHelp
  )
}

export const generateHelpForCommands = commands => {
  return _.reverse(
    _.map(commands, command => {
      return substituteInputParamsForHelp(command).join('\n\t')
    })
  ).join('\n\n')
}

export const generateHelp = (intro, commands) => {
  // TODO return array instead of join \n\n
  return _.join(
    [ intro, 'commands:', generateHelpForCommands(commands) ],
    '\n\n'
  )
}

export const listExamples = command => {
  // let help = _.clone(command.vocabulary)
  const examples = _.map(command.examples, example => {
    const ex = `\`${example.input}\``
    return _.join([ ex, '-', example.name ], ' ')
  })
  return _.concat(_.head(substituteVocabularyArgNames(command)), examples)
}

export const generateExamplesForCommands = commands => {
  return _.reverse(
    _.map(commands, command => {
      return listExamples(command).join('\n\t')
    })
  ).join('\n\n')
}

export const generateExamples = (commandName, commands) => {
  // TODO return array instead of join \n\n
  return _.join(
    [ `${commandName} examples:`, generateExamplesForCommands(commands) ],
    '\n\n'
  )
}
