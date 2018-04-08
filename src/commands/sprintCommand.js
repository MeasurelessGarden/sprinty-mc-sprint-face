import {
  generateSprintWithEndTime,
  generateSprintWithDuration,
} from './timeUtils.js'

export const sprintHelpIntro = `There are many valid ways to start a sprint.`

/* TODO
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

export const sprintCommands = [
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
