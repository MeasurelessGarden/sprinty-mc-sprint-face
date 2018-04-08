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
}

export const sprintCommands = [
  // order is used to resolve commands without conflicts
  {
    vocabulary: [ 'sprint', 'at', 'Number', 'to', 'Number' ],
    template: WithEndTimeTemplate,
    examples: [
      // TODO test each example against the specific command it belongs to, instead of just the overall command list - otherwise examples could apply to different parsing than they are labeled for! (it's ok if 2 commands parse the same phrase - as long as they parse it the same!)
      {
        name: 'straight-forward',
        input: 'sprint at :15 to :45',
        startMin: '15',
        endMin: '45',
      },
      {
        name: 'verbose and natural',
        input: 'anyone want to sprint at :15 to :45?',
        startMin: '15',
        endMin: '45',
      },
      {
        name: 'wraps to next hour',
        input: 'sprint at 35 to 20',
        startMin: '35',
        endHour: '01',
        endMin: '20',
      },
      {
        name: 'to the end of the hour',
        input: 'sprint at 10 to 59',
        startMin: '10',
        endMin: '59',
      },
      {
        name: 'to the beginning of the next hour',
        input: 'sprint at 10 to 0',
        startMin: '10',
        endHour: '01',
        endMin: '00',
      },
      {
        name: 'using two digits for minutes',
        input: 'sprint at 10 to 00',
        startMin: '10',
        endHour: '01',
        endMin: '00',
      },
    ],
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
