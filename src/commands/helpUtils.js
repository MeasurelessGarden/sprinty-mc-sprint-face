var _ = require('lodash')

/*
const WithEndTimeTemplate = {
  input: [
    {
      name: 'start time',
      type: 'Number', // TODO validate that a command cannot use this template unless it has the right args inside it (include default param - meaning not required for this, and also has a value)
      units: 'minutes of hour',
      description: 'must be in the range [0:59]',
      checks: [ arg => arg >= 0, arg => arg < 60 ],
    },
    {
      name: 'end time',
      type: 'Number',
      units: 'minutes of hour',
      description: 'must be in the range [0:59]',
      checks: [ arg => arg >= 0, arg => arg < 60 ],
    },
  ],
  call: generateSprintWithEndTime,
  additionalHelp:
    'Start and end times are always assumed to be in the future and correctly ordered, so the final result will jump forward by an hour if needed to create a valid sprint.',
  // examples: [], // TODO generate help docs and tests from these!
}
*/
/*
export const sprintCommands = [
  {
    vocabulary: [ 'sprint', 'at', 'Number', 'to', 'Number' ],
    template: WithEndTimeTemplate,
  },
  */

// let sprintHelp = SprintHelp + '\n'
// _.each(SprintCommands, sprintCommand => {
//   // console.log('asdfasfasdf', _.join(sprintCommand.command, ' '))
//   sprintHelp = sprintHelp + '\n' + _.join(sprintCommand.command, ' ')
// })

export const substituteInputParamsForHelp = command => {
  // _.map(commands, command => {
  let help = command.vocabulary // TODO is this a copy??
  // _.each(command.template.input, input => {
  //   const inputHelp = _.toUpper(`[${input.name}]`)
  //   _.fill(help, inputHelp, _.indexOf(help, input.type))
  // })
  const inputDesc = _.map(command.template.input, input => {
    const name = _.toUpper(input.name) // TODO bold name with **?
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
  // })
}

export const generateHelpForCommands = commands => {
  return _.map(commands, command => {
    return substituteInputParamsForHelp(command).join('\n\t')
  }).join('\n\n')
}

export const generateHelp = (intro, commands) => {
  return [ intro, 'commands:', generateHelpForCommands(commands) ].join('\n\n')
}
