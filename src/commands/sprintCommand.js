import {
  generateSprintWithEndTime,
  generateSprintWithDuration,
} from './timeUtils.js'

// TODO main command: 'sprint' --> @Sprinty help sprint
// @Sprinty help sprint examples
// TODO tag each example (list) - 'basic', 'verbose', 'natural', 'invalid', 'deceptive', 'clock notation', 'long', 'short' - a more formal variation than what's in the name (possibly even generate the name from it?)
export const sprintIntro = `There are many valid ways to start a sprint.`

/*
Examples:
///should we go at 10?
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
        // TODO add flag for examples to include in help, and also tests to generate those messages!
        name: 'straight-forward', // TODO flag these help: 'basic'?
        input: 'sprint at :15 to :45',
        startMin: '15',
        endMin: '45',
      },
      {
        name: 'potentially confusing extra numbers (maybe deceptive)',
        input: 'sprint at 15 with extra 5 number to 30',
        startMin: '15',
        endMin: '30',
      },
      {
        name: 'verbose and natural',
        input: 'anyone want to sprint at :15 to :45?', // TODO flag these help: 'verbose'?
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
    examples: [
      {
        name: 'natural',
        input: "let's sprint 40 to 45",
        startMin: '40',
        endMin: '45',
      },
      {
        name: 'natural, question',
        input: 'sprint from 13 to 29??',
        startMin: '13',
        endMin: '29',
      },
      {
        name: 'straight-forward',
        input: 'sprint 15 to 25',
        startMin: '15',
        endMin: '25',
      },
      {
        name: 'clock notation',
        input: 'sprint 15 to :35',
        startMin: '15',
        endMin: '35',
      },
      {
        name: 'very short',
        input: 'sprint at 10 to 11',
        startMin: '10',
        endMin: '11',
      },
      {
        name: 'implied hour',
        input: 'sprint 10 to 10',
        startMin: '10',
        endHour: '01',
        endMin: '10',
      },
      // {
      //   name: '',
      //   input: ,
      //   startMin: '',
      //   endHour: '',
      //   endMin: '',
      // },
    ],
  },
  {
    vocabulary: [ 'sprint', 'at', 'Number', 'for', 'Number' ],
    template: WithDurationTemplate,
    examples: [
      {
        name: '10 minute sprint',
        input: 'sprint at 27 for 10 min',
        startMin: '27',
        endMin: '37',
      },
      {
        name: 'short and sweet',
        input: 'sprint at 20 for 6 min',
        startMin: '20',
        endMin: '26',
      },
      {
        name: '',
        input: 'sprint at 30 for 14',
        startMin: '30',
        endMin: '44',
      },
      {
        name: 'straight-forward',
        input: 'sprint at 35 for 14',
        startMin: '35',
        endMin: '49',
      },
      {
        name: 'long running',
        input: 'sprint at 55 for 55',
        startMin: '55',
        endHour: '01',
        endMin: '50',
      },
      {
        name: 'slightly longer than default',
        input: 'sprint at 30 for 34 minutes',
        startMin: '30',
        endHour: '01',
        endMin: '04',
      },
      {
        name: 'maximum length sprint',
        input: 'sprint at 10 for 60',
        startMin: '10',
        endHour: '01',
        endMin: '10',
      },

      {
        name: 'very short sprint',
        input: 'sprint at 10 for 1',
        startMin: '10',
        endMin: '11',
      },
    ],
  },
  {
    vocabulary: [ 'sprint', 'Number', 'for', 'Number' ],
    template: WithDurationTemplate,
    examples: [
      {
        name: 'uncommon start and stop time',
        input: 'sprint 57 for 32',
        startMin: '57',
        endHour: '01',
        endMin: '29',
      },
      {
        name: 'natural and verbose, with clock notation',
        input: 'shall we sprint :20 for about 55 min?',
        startMin: '20',
        endHour: '01',
        endMin: '15', // TODO also make example output if run later in the hour (for help)
      },
      {
        name: 'simple',
        input: 'sprint 30 for 34 minutes',
        startMin: '30',
        endHour: '01',
        endMin: '04',
      },
      {
        name: 'confusing (deceptive), the word hour is ignored',
        input: 'sprint 30 for 1 hour',
        startMin: '30',
        endMin: '31',
      },
      {
        name: 'straight-forward',
        input: 'sprint 15 for 20',
        startMin: '15',
        endMin: '35',
      },
      {
        name:
          'deceptive punctuation (interpreted as sprint 15 for 1 and the 5 is nonsense)',
        input: 'sprint 15 for 1.5 minutes',
        startMin: '15',
        endMin: '16',
      },
    ],
  },
  {
    vocabulary: [ 'sprint', 'at', 'Number' ],
    template: WithDurationDefaultTemplate,
    examples: [
      {
        name: 'enthusiastic',
        input: 'ANYONE WANT TO SPRINT AT 25?',
        startMin: '25',
        endMin: '55',
      },
      {
        name: 'natural',
        input: 'I want to sprint at :45',
        startMin: '45',
        endHour: '01',
        endMin: '15',
      },
      {
        name: 'straight-forward',
        input: 'sprint at 20',
        startMin: '20',
        endMin: '50',
      },
      {
        name: 'straight-forward',
        input: 'sprint at 25',
        startMin: '25',
        endMin: '55',
      },
      {
        name: 'straight-forward',
        input: 'sprint at 30',
        startMin: '30',
        endHour: '01',
        endMin: '00',
      },
      {
        name: 'end of the hour',
        input: 'sprint at 59',
        startMin: '59',
        endHour: '01',
        endMin: '29',
      },
    ],
  },
  {
    vocabulary: [ 'sprint', 'Number' ],
    template: WithDurationDefaultTemplate,
    examples: [
      {
        name: 'straight-forward',
        input: 'sprint 15',
        startMin: '15',
        endMin: '45',
      },
      {
        name: 'with clock-minute notation',
        input: 'sprint :15',
        startMin: '15',
        endMin: '45',
      },
      {
        name: 'deceptive negatives',
        input: 'sprint -15',
        startMin: '15',
        endMin: '45',
      },
    ],
  },
]
