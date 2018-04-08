var _ = require('lodash')
import {parseMessageToArgs} from '../parse/util'
import {
  generateSprintWithEndTime,
  generateSprintWithDuration,
} from './timeUtils.js'

export const help =
  'There are a lot of ways to start a sprint! Other sprint commands you might care about are "cancel" and "info".'
/*
Examples:
ANYONE WANT TO SPRINT AT 25?
I want to sprint at :45
let's sprint 40 to 45
sprint 15
sprint 15 to 25
sprint 15 to :35
sprint 57 for 32
sprint :15
sprint at 20
sprint at 25
sprint at 27 for 10 min
sprint at 30
sprint at 30 for 14
sprint at 35 for 14
sprint at 35 to 20
sprint at 55 for 55
shall we sprint :20 for about 55 min?
sprint 30 for 34 minutes
sprint at 20 for 6 min
///should we go at 10?
(also compile a list from all the tests! THEY'RE ALL OVER!)
*/

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

const WithDurationTemplate = {
  input: [
    {
      name: 'start time',
      type: 'Number',
      units: 'minutes of hour',
      description: 'must be in the range [0:59]',
      checks: [ arg => arg >= 0, arg => arg < 60 ],
    },
    {
      name: 'duration',
      type: 'Number',
      units: 'minutes',
      description: 'must be in the range [1:60]',
      checks: [ arg => arg > 0, arg => arg <= 60 ],
    },
  ],
  call: generateSprintWithDuration,
  additionalHelp:
    'Start time is always assumed to be in the future, so the final result will jump forward by an hour if needed to create a valid sprint. Sprints cannot be longer than an hour.',
  // examples: [], // TODO generate help docs and tests from these!
}

const WithDurationDefaultTemplate = {
  input: [
    {
      name: 'start time',
      type: 'Number',
      units: 'minutes of hour',
      description: 'must be in the range [0:59]',
      checks: [ arg => arg >= 0, arg => arg < 60 ],
    },
  ],
  call: (...args) => {
    return generateSprintWithDuration(...args, 30)
  },
  additionalHelp:
    'Start time is always assumed to be in the future, so the final result will jump forward by an hour if needed to create a valid sprint. Sprints default to 30 min.',
  // examples: [], // TODO generate help docs and tests from these!
}

export const commands = [
  // order is used to resolve commands without conflicts
  {
    vocabulary: [ 'sprint', 'at', 'Number', 'to', 'Number' ],
    template: WithEndTimeTemplate,
  },
  {
    vocabulary: [ 'sprint', 'Number', 'to', 'Number' ],
    template: WithEndTimeTemplate,
  },
  {
    vocabulary: [ 'sprint', 'at', 'Number', 'for', 'Number' ],
    template: WithDurationTemplate,
  },
  {
    vocabulary: [ 'sprint', 'Number', 'for', 'Number' ],
    template: WithDurationTemplate,
  },
  {
    vocabulary: [ 'sprint', 'at', 'Number' ],
    template: WithDurationDefaultTemplate,
  },
  {
    vocabulary: [ 'sprint', 'Number' ],
    template: WithDurationDefaultTemplate,
  },
]

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

export const createSprintFromMessage = (message, timestamp) => {
  // timestamp -> pass in Message.createdTimestamp ie 1522815707792
  const config = _.find(commands, config => {
    return parseMessageToArgs(message, config.vocabulary) // TODO how to prevent running this twice? do I care? it bugs me, but it's probably fine
  })
  if (config) {
    // const commandArgs = config.args(
    //   // new Date(timestamp), // all sprint
    //   parseMessageToArgs(message, config.vocabulary)
    // )
    const commandArgs = parseCommandArgs(
      config.vocabulary,
      parseMessageToArgs(message, config.vocabulary),
      config.template.input
    )
    // if (config.validate(commandArgs)) {
    //   const sprint = config.call(args)
    //   return sprint
    // }
    if (validate(config.template.input, commandArgs)) {
      const functionArgs = _.concat([ timestamp ], commandArgs) // TODO actually.... probably makes sense just to pass in the timestamp anyway....
      const sprint = config.template.call(...functionArgs)
      return sprint
    }
  }
}
