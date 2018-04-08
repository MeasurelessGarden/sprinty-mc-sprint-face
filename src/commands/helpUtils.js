var _ = require('lodash')

export const substituteInputParamsForHelp = command => {
  let help = command.vocabulary // TODO is this a copy??
  const inputDesc = _.map(command.template.input, input => {
    const name = _.toUpper(input.name) // TODO formatting: bold name with **?
    const units = `(${input.units})`
    // sub Number in vocab as a side effect
    const vocabSub = `[${name}]`
    const index = _.indexOf(help, input.type)
    _.fill(help, vocabSub, index, index + 1)
    return _.join([ name, units, '-', input.description ], ' ')
  })
  return _.concat(
    [ _.join(help, ' ') ],
    inputDesc,
    command.template.additionalHelp
  )
}

export const generateHelpForCommands = commands => {
  return _.map(commands, command => {
    return substituteInputParamsForHelp(command).join('\n\t')
  }).join('\n\n')
}

export const generateHelp = (intro, commands) => {
  return [ intro, 'commands:', generateHelpForCommands(commands) ].join('\n\n')
}
