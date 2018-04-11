import {
  generateSprintWithEndTime,
  generateSprintWithDuration,
  generateSprintInDeltaWithEndTime,
  generateSprintInDeltaWithDuration,
} from '../utils/timeUtils.js'

// TODO main command: 'sprint' --> @Sprinty help sprint
// @Sprinty help sprint examples
export const sprintIntro = `There are many valid ways to start a sprint.`

/*
Examples:
///should we go at 10?
// TODO should we go again at 10? (ie: start another)
*/

const MinuteOfHourInput = name => {
  return {
    name: name,
    type: 'Number', // TODO validate that a command cannot use this template unless it has the right args inside it (include default param - meaning not required for this, and also has a value)
    units: 'minutes of hour',
    description: 'must be in the range [0:59]',
    checks: [ arg => arg >= 0, arg => arg < 60 ],
  }
}

const MinutesInput = name => {
  // the name 'MinutesInput' does not accurately reflect that it's *up to 60 minutes*
  return {
    name: name,
    type: 'Number',
    units: 'minutes',
    description: 'must be in the range [1:60]',
    checks: [ arg => arg > 0, arg => arg <= 60 ],
  }
}

const WithEndTimeTemplate = {
  input: [ MinuteOfHourInput('start time'), MinuteOfHourInput('end time') ],
  call: generateSprintWithEndTime,
  additionalHelp:
    'Start and end times are always assumed to be in the future and correctly ordered, so the final result will jump forward by an hour if needed to create a valid sprint.',
}

const WithDurationTemplate = {
  input: [ MinuteOfHourInput('start time'), MinutesInput('duration') ],
  call: generateSprintWithDuration,
  additionalHelp:
    'Start time is always assumed to be in the future, so the final result will jump forward by an hour if needed to create a valid sprint. Sprints cannot be longer than an hour.',
}

const WithDurationDefaultTemplate = {
  input: [ MinuteOfHourInput('start time') ],
  call: (...args) => {
    return generateSprintWithDuration(...args, 30)
  },
  additionalHelp:
    'Start time is always assumed to be in the future, so the final result will jump forward by an hour if needed to create a valid sprint. Sprints default to 30 min.',
}

const WithDeltaDurationTemplate = {
  input: [ MinutesInput('delta'), MinutesInput('duration') ],
  call: generateSprintInDeltaWithDuration,
  additionalHelp: 'Start a sprint in a few minutes (up to an hour).',
}

const WithDeltaTemplate = {
  input: [ MinutesInput('delta') ],
  call: (...args) => {
    return generateSprintInDeltaWithDuration(...args, 30)
  },
  additionalHelp:
    'Start a sprint in a few minutes (up to an hour). Sprints default to 30 min.',
}

const WithNowDurationTemplate = {
  input: [ MinutesInput('duration') ],
  call: (...args) => {
    return generateSprintInDeltaWithDuration(args[0], 1, args[1])
  },
  additionalHelp:
    'Start a sprint now for the specfied number of minutes (up to an hour).',
}

const WithNowEndTimeTemplate = {
  input: [ MinuteOfHourInput('end time') ],
  call: (...args) => {
    return generateSprintInDeltaWithEndTime(args[0], 1, args[1])
  },
  additionalHelp: 'Start a sprint now until the specified end time.',
}

const WithNowDefaultTemplate = {
  input: [],
  call: (...args) => {
    return generateSprintInDeltaWithDuration(args[0], 1, 30)
  },
  additionalHelp: 'Start a sprint now. Sprints default to 30 min.',
}

// TODO sprint now for 1, sprint in 2 for 3 .... doesn't work?

export const sprintCommands = [
  // order is used to resolve commands without conflicts
  {
    vocabulary: [
      [ 'sprint', 'sprinting' ], // TODO sprint starting in...
      [ 'in' ],
      'Number',
      [ 'for' ],
      'Number',
    ],
    template: WithDeltaDurationTemplate,
    // TODO tag each example (list) - 'basic', 'verbose', 'natural', 'invalid', 'deceptive', 'clock notation', 'long', 'short' - a more formal variation than what's in the name (possibly even generate the name from it?)
    // TODO make tags constants?
    // TODO: ALL TAGS: idk, 'meaning of \'now\'', literal, basic, natural, short long, clock-notation, 'clock behavior', alternate wording,'ambiguous', 'confusing', TODO omg this is horrid: 'clock wrapping hour thing'
    examples: [
      {
        name: 'straight-forward',
        input: 'sprint in 15 for 20',
        tags: [ 'literal', 'basic' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '15',
            endMin: '35',
          },
          {
            calledAtMin: '30',
            startMin: '45',
            endHour: '01',
            endMin: '05',
          },
          {
            calledAtMin: '50',
            startHour: '01',
            startMin: '05',
            endHour: '01',
            endMin: '25',
          },
        ],
      },
      {
        name: 'straight-forward',
        input: 'sprint in 60 for 15',
        tags: [ 'literal', 'basic' ],
        tests: [
          {
            calledAtMin: '00',
            startHour: '01',
            startMin: '00',
            endHour: '01',
            endMin: '15',
          },
          {
            calledAtMin: '30',
            startHour: '01',
            startMin: '30',
            endHour: '01',
            endMin: '45',
          },
        ],
      },
      {
        name: 'straight-forward',
        input: 'sprint in 60 for 60 minutes',
        tags: [ 'long' ],
        tests: [
          {
            calledAtMin: '00',
            startHour: '01',
            startMin: '00',
            endHour: '02',
            endMin: '00',
          },
          {
            calledAtMin: '30',
            startHour: '01',
            startMin: '30',
            endHour: '02',
            endMin: '30',
          },
        ],
      },
    ],
    invalidExamples: [
      // TODO generate tests from these, as well as more help docs
      'sprint in 61 for 5',
      'sprint in 15 for 61',
      'sprint in 15 for 0',
      'sprint in 0 for 5',
    ],
    // ambigulousExamples: [] // TODO these are ones like cancel sprint from 15 to 30 mentinoed elsewhere - go find that and write the example and then also some tests! (test against ALL commands ever)
  },
  {
    vocabulary: [
      [ 'sprint', 'sprinting' ], // TODO sprint starting in...
      [ 'in' ],
      'Number',
    ],
    template: WithDeltaTemplate,
    examples: [
      {
        name: 'straight-forward', // TODO nuke name? generate name from tags? other?
        input: 'sprint in 15',
        tags: [ 'literal', 'basic' ], // TODO use in help (display in general and subset with command)
        tests: [
          {
            calledAtMin: '00', // TODO generate more complete examples, test that these are matching this exact command, or if there are conflicts (and if those conflicts resolve to the same sprint or not)
            startMin: '15', // TODO I should probably generate some help docs with all the commands, variations, examples, invalid examples, potential conflicts documented with automated tests (wherever I end up putting those) - and just like 'publish' those, and keep the in-discord help shorter?
            endMin: '45', // TODO following up on above... I need to look over the list of examples and nuke any that are overkill for duplication...
          },
          {
            calledAtMin: '30',
            startMin: '45',
            endHour: '01',
            endMin: '15',
          },
        ],
      },
    ],
  },
  {
    vocabulary: [
      [ 'sprint', 'sprinting' ],
      [ 'at', 'around' ],
      'Number',
      [ 'to', 'until' ],
      'Number',
    ],
    template: WithEndTimeTemplate,
    examples: [
      // TODO test each example against the specific command it belongs to, instead of just the overall command list - otherwise examples could apply to different parsing than they are labeled for! (it's ok if 2 commands parse the same phrase - as long as they parse it the same!)
      {
        // TODO add flag for examples to include in help, and also tests to generate those messages!
        name: 'straight-forward',
        input: 'sprint at :15 to :45',
        tags: [ 'literal', 'basic', 'clock-notation' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '15',
            endMin: '45',
          },
          {
            calledAtMin: '30',
            startHour: '01',
            startMin: '15',
            endHour: '01',
            endMin: '45',
          },
        ],
      },
      {
        name: 'alternate wording: until',
        input: 'sprint at :15 until :45',
        tags: [ 'literal', 'basic', 'clock-notation', 'alternate wording' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '15',
            endMin: '45',
          },
        ],
      },
      {
        name: 'potentially confusing extra numbers (maybe deceptive)',
        input: 'sprint at 15 with extra 5 number to 30',
        tags: [ 'ambiguous', 'confusing' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '15',
            endMin: '30',
          },
        ],
      },
      {
        name: 'alternate wording: sprinting around',
        input: 'sprinting around 15 to 30',
        tags: [ 'alternate wording' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '15',
            endMin: '30',
          },
        ],
      },
      {
        name: 'verbose and natural',
        tags: [ 'natural', 'clock-notation' ],
        input: 'anyone want to sprint at :15 to :45?', // TODO flag these help: 'verbose'?
        tests: [
          {
            calledAtMin: '00',
            startMin: '15',
            endMin: '45',
          },
        ],
      },
      {
        name: 'wraps to next hour',
        input: 'sprint at 35 to 20',
        tags: [ 'clock wrapping hour thing', 'hour boundaries' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '35',
            endHour: '01',
            endMin: '20',
          },
          {
            calledAtMin: '45',
            startHour: '01',
            startMin: '35',
            endHour: '02',
            endMin: '20',
          },
          {
            calledAtHour: '04',
            calledAtMin: '21',
            calledAtSec: '47.792',
            startHour: '04',
            startMin: '35',
            endHour: '05',
            endMin: '20',
          },
        ],
      },
      {
        name: 'to the end of the hour',
        input: 'sprint at 10 to 59',
        tags: [ 'hour boundaries' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '10',
            endMin: '59',
          },
        ],
      },
      {
        name: 'to the beginning of the next hour',
        input: 'sprint at 10 to 0',
        tags: [ 'hour boundaries' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '10',
            endHour: '01',
            endMin: '00',
          },
        ],
      },
      {
        name: 'using two digits for minutes',
        input: 'sprint at 10 to 00',
        tags: [ 'clock-notation', 'hour boundaries' ], // TODO hour boundaries -> clock behavior
        tests: [
          {
            calledAtMin: '00',
            startMin: '10',
            endHour: '01',
            endMin: '00',
          },
        ],
      },
    ],
  },
  {
    vocabulary: [
      [ 'sprint', 'sprinting' ],
      'Number',
      [ 'to', 'until' ],
      'Number',
    ],
    template: WithEndTimeTemplate,
    examples: [
      {
        name: 'natural',
        input: "let's sprint 40 to 45",
        tags: [ 'natural' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '40',
            endMin: '45',
          },
          {
            calledAtHour: '04',
            calledAtMin: '21',
            calledAtSec: '47.792',
            startHour: '04',
            startMin: '40',
            endHour: '04',
            endMin: '45',
          },
        ],
      },
      {
        name: 'alternate wording',
        input: 'sprinting 40 until 45',
        tags: [ 'alternate wording' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '40',
            endMin: '45',
          },
        ],
      },
      {
        name: 'natural, question',
        input: 'sprint from 13 to 29??',
        tags: [ 'natural' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '13',
            endMin: '29',
          },
        ],
      },
      {
        name: 'straight-forward',
        input: 'sprint 15 to 25',
        tags: [ 'literal', 'basic' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '15',
            endMin: '25',
          },
          {
            calledAtHour: '04',
            calledAtMin: '21',
            calledAtSec: '47.792',
            startHour: '05',
            startMin: '15',
            endHour: '05',
            endMin: '25',
          },
        ],
      },
      {
        name: 'clock notation',

        input: 'sprint 15 to :35',
        tags: [ 'clock-notation' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '15',
            endMin: '35',
          },
          {
            calledAtHour: '04',
            calledAtMin: '21',
            calledAtSec: '47.792',
            startHour: '05',
            startMin: '15',
            endHour: '05',
            endMin: '35',
          },
        ],
      },
      {
        name: 'very short',
        input: 'sprint at 10 to 11',
        tags: [ 'short' ], //TODO lower limits?
        tests: [
          {
            calledAtMin: '00',
            startMin: '10',
            endMin: '11',
          },
        ],
      },
      {
        name: 'implied hour',
        input: 'sprint 10 to 10',
        tags: [ 'long', 'clock behavior' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '10',
            endHour: '01',
            endMin: '10',
          },
          {
            calledAtMin: '15',
            startHour: '01',
            startMin: '10',
            endHour: '02',
            endMin: '10',
          },
        ],
      },
    ],
  },
  {
    vocabulary: [
      [ 'sprint', 'sprinting' ],
      [ 'at', 'around' ],
      'Number',
      [ 'for' ],
      'Number',
    ],
    template: WithDurationTemplate,
    examples: [
      {
        name: 'natural inquery',
        input: 'sprint at 25 for 30?',
        tags: [ 'natural' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '25',
            endMin: '55',
          },
        ],
      },
      {
        name: 'alternate wording',
        input: 'sprinting around 25 for 30?',
        tags: [ 'alternate wording' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '25',
            endMin: '55',
          },
        ],
      },
      {
        name: '10 minute sprint',
        input: 'sprint at 27 for 10 min',
        tags: [ 'idk' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '27',
            endMin: '37',
          },
        ],
      },
      {
        name: 'short and sweet',
        input: 'sprint at 20 for 6 min',
        tags: [ 'short' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '20',
            endMin: '26',
          },
          {
            calledAtHour: '04',
            calledAtMin: '21',
            calledAtSec: '47.792',
            startHour: '05',
            startMin: '20',
            endHour: '05',
            endMin: '26',
          },
        ],
      },
      {
        name: 'straight-forward',
        input: 'sprint at 30 for 14',
        tags: [ 'literal', 'basic' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '30',
            endMin: '44',
          },

          {
            calledAtHour: '04',
            calledAtMin: '21',
            calledAtSec: '47.792',
            startHour: '04',
            startMin: '30',
            endHour: '04',
            endMin: '44',
          },
        ],
      },
      {
        name: 'straight-forward',
        input: 'sprint at 35 for 14',
        tags: [ 'literal' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '35',
            endMin: '49',
          },
          {
            calledAtHour: '04',
            calledAtMin: '21',
            calledAtSec: '47.792',
            startHour: '04',
            startMin: '35',
            endHour: '04',
            endMin: '49',
          },
        ],
      },
      {
        name: 'long running',
        input: 'sprint at 55 for 55',
        tags: [ 'long' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '55',
            endHour: '01',
            endMin: '50',
          },
          {
            calledAtMin: '56',
            startHour: '01',
            startMin: '55',
            endHour: '02',
            endMin: '50',
          },
          {
            calledAtHour: '04',
            calledAtMin: '21',
            calledAtSec: '47.792',
            startHour: '04',
            startMin: '55',
            endHour: '05',
            endMin: '50',
          },
        ],
      },
      {
        name: 'slightly longer than default',
        input: 'sprint at 30 for 34 minutes',
        tags: [ 'idk' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '30',
            endHour: '01',
            endMin: '04',
          },
          {
            calledAtHour: '04',
            calledAtMin: '21',
            calledAtSec: '47.792',
            startHour: '04',
            startMin: '30',
            endHour: '05',
            endMin: '04',
          },
        ],
      },
      {
        name: 'maximum length sprint',
        input: 'sprint at 10 for 60',

        tags: [ 'long' ], // TODO limits? describe what is under test in some way...
        tests: [
          {
            calledAtMin: '00',
            startMin: '10',
            endHour: '01',
            endMin: '10',
          },
          {
            calledAtMin: '15',
            startHour: '01',
            startMin: '10',
            endHour: '02',
            endMin: '10',
          },
        ],
      },

      {
        name: 'very short sprint',
        input: 'sprint at 10 for 1',
        tags: [ 'short' ], // TODO limits? describe what is under test in some way...
        tests: [
          {
            calledAtMin: '00',
            startMin: '10',
            endMin: '11',
          },
        ],
      },
    ],
  },
  {
    vocabulary: [ [ 'sprint', 'sprinting' ], 'Number', [ 'for' ], 'Number' ],
    template: WithDurationTemplate,
    examples: [
      {
        name: 'uncommon start and stop time',
        input: 'sprint 57 for 32',
        tags: [ 'literal', 'basic' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '57',
            endHour: '01',
            endMin: '29',
          },
          {
            calledAtHour: '04',
            calledAtMin: '21',
            calledAtSec: '47.792',
            startHour: '04',
            startMin: '57',
            endHour: '05',
            endMin: '29',
          },
        ],
      },
      {
        name: 'natural and verbose, with clock notation',
        input: 'shall we sprint :20 for about 55 min?',
        tags: [ 'natural', 'clock-notation' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '20',
            endHour: '01',
            endMin: '15',
          },
          {
            calledAtMin: '30',
            startHour: '01',
            startMin: '20',
            endHour: '02',
            endMin: '15',
          },

          {
            calledAtHour: '04',
            calledAtMin: '21',
            calledAtSec: '47.792',
            startHour: '05',
            startMin: '20',
            endHour: '06',
            endMin: '15',
          },
        ],
      },
      {
        name: 'simple',
        input: 'sprint 30 for 34 minutes',
        tags: [ 'idk' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '30',
            endHour: '01',
            endMin: '04',
          },

          {
            calledAtHour: '04',
            calledAtMin: '21',
            calledAtSec: '47.792',
            startHour: '04',
            startMin: '30',
            endHour: '05',
            endMin: '04',
          },
        ],
      },
      {
        name: 'confusing (deceptive), the word hour is ignored',
        input: 'sprint 30 for 1 hour',
        tags: [ 'confusing' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '30',
            endMin: '31',
          },
        ],
      },
      {
        name: 'straight-forward',
        input: 'sprint 15 for 20',
        tags: [ 'basic', 'literal' ], // TODO in help note: literal means 'no extra words' ... idk if basic is the same or not...
        tests: [
          {
            calledAtMin: '00',
            startMin: '15',
            endMin: '35',
          },
        ],
      },
      {
        name:
          'deceptive punctuation (interpreted as sprint 15 for 1 and the 5 is nonsense)',
        input: 'sprint 15 for 1.5 minutes',
        tags: [ 'confusing' ], // TODO confusing tags will need to continue showing either name or some sort of description in help
        tests: [
          {
            calledAtMin: '00',
            startMin: '15',
            endMin: '16',
          },
        ],
      },
    ],
  },
  {
    vocabulary: [ [ 'sprint', 'sprinting' ], [ 'to', 'until' ], 'Number' ],
    template: WithNowEndTimeTemplate,
    examples: [
      {
        name: 'straight-forward',
        input: 'sprint until 15',
        tags: [ 'basic', 'literal', 'alternate wording' ], // TODO ditch 'basic' tag, and make sure first tag in each block is always the default example...
        tests: [
          {
            calledAtMin: '00',
            startMin: '01',
            endMin: '15',
          },
        ],
      },
    ],
  },
  {
    vocabulary: [
      [ 'sprint', 'sprinting' ],
      [ 'now' ],
      [ 'to', 'until' ],
      'Number',
    ],
    template: WithNowEndTimeTemplate,
    examples: [
      {
        name: 'straight-forward',
        input: 'sprint now until 32',
        tags: [ 'basic', 'clock behavior', "meaning of 'now'" ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '01',
            endMin: '32',
          },
        ],
      },
      {
        name: 'natural',
        input: "well i'm sprinting now to :55",
        tags: [
          'basic',
          'clock-notation',
          'clock behavior',
          "meaning of 'now'",
        ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '01',
            endMin: '55',
          },
        ],
      },
    ],
  },
  {
    vocabulary: [ [ 'sprint', 'sprinting' ], [ 'now' ], [ 'for' ], 'Number' ],
    template: WithNowDurationTemplate,
    examples: [
      {
        name: 'straight-forward',
        input: 'sprint now for 32',
        tags: [ 'basic', 'clock behavior', "meaning of 'now'" ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '01',
            endMin: '33',
          },
        ],
      },
    ],
  },
  {
    vocabulary: [ [ 'sprint', 'sprinting' ], [ 'for' ], 'Number' ],
    template: WithNowDurationTemplate,
    examples: [
      {
        name: 'implies: start now',
        input: 'sprint for 32 minutes',
        tags: [ 'clock behavior', "meaning of 'now'" ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '01',
            endMin: '33',
          },
        ],
      },
      {
        name: 'implies: start now',
        input: 'sprint for 12',
        tags: [ 'basic', 'clock behavior', "meaning of 'now'" ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '01',
            endMin: '13',
          },
        ],
      },
    ],
  },
  {
    vocabulary: [ [ 'sprint', 'sprinting' ], [ 'at', 'around' ], 'Number' ],
    template: WithDurationDefaultTemplate,
    examples: [
      {
        name: 'enthusiastic',
        input: 'ANYONE WANT TO SPRINT AT 25?',
        tags: [ 'natural' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '25',
            endMin: '55',
          },
          {
            calledAtHour: '04',
            calledAtMin: '21',
            calledAtSec: '47.792',
            startHour: '04',
            startMin: '25',
            endHour: '04',
            endMin: '55',
          },
        ],
      },
      {
        name: 'alternate wording',
        input: 'sprinting around 25?',
        tags: [ 'natural', 'alternate wording' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '25',
            endMin: '55',
          },
        ],
      },
      {
        name: 'natural',
        input: 'I want to sprint at :45',
        tags: [ 'natural', 'clock-notation' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '45',
            endHour: '01',
            endMin: '15',
          },
          {
            calledAtHour: '04',
            calledAtMin: '21',
            calledAtSec: '47.792',
            startHour: '04',
            startMin: '45',
            endHour: '05',
            endMin: '15',
          },
        ],
      },
      {
        name: 'straight-forward',
        input: 'sprint at 20',
        tags: [ 'basic' ], // TODO 'default values'? 'implied values'?
        tests: [
          {
            calledAtMin: '00',
            startMin: '20',
            endMin: '50',
          },

          {
            calledAtHour: '04',
            calledAtMin: '21',
            calledAtSec: '47.792',
            startHour: '05',
            startMin: '20',
            endHour: '05',
            endMin: '50',
          },
        ],
      },
      {
        name: 'straight-forward',
        input: 'sprint at 25',
        tags: [ 'basic' ],
        tests: [
          {
            calledAtMin: '00', // TODO I'm pretty sure these handful of tests are to test clock-wrapping behavior - if so add more test cases to match
            startMin: '25',
            endMin: '55',
          },
          {
            calledAtHour: '04',
            calledAtMin: '21',
            calledAtSec: '47.792',
            startHour: '04',
            startMin: '25',
            endHour: '04',
            endMin: '55',
          },
        ],
      },
      {
        name: 'straight-forward',
        input: 'sprint at 30',
        tags: [ 'basic' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '30',
            endHour: '01',
            endMin: '00',
          },
          {
            calledAtHour: '04',
            calledAtMin: '21',
            calledAtSec: '47.792',
            startHour: '04',
            startMin: '30',
            endHour: '05',
            endMin: '00',
          },
        ],
      },
      {
        name: 'end of the hour',
        input: 'sprint at 59',
        tags: [ 'clock behavior' ], // TODO limits?
        tests: [
          {
            calledAtMin: '00',
            startMin: '59',
            endHour: '01',
            endMin: '29',
          },
        ],
      },
    ],
  },
  {
    vocabulary: [ [ 'sprint' ], [ 'now' ] ],
    template: WithNowDefaultTemplate,
    examples: [
      {
        name: 'straight-forward',
        input: 'sprint now',
        tags: [ "meaning of 'now'" ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '01',
            endMin: '31',
          },
          {
            calledAtMin: '47',
            startMin: '48',
            endHour: '01',
            endMin: '18',
          },
        ],
      },
      {
        name: 'natural',
        input: 'lets sprint right now!',
        tags: [ "meaning of 'now'", 'natural' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '01',
            endMin: '31',
          },
        ],
      },
    ],
  },
  {
    vocabulary: [ [ 'sprint' ], 'Number' ],
    template: WithDurationDefaultTemplate,
    examples: [
      {
        name: 'straight-forward',
        input: 'sprint 15',
        tags: [ 'literal' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '15',
            endMin: '45',
          },
          {
            calledAtHour: '04',
            calledAtMin: '21',
            calledAtSec: '47.792',
            startHour: '05',
            startMin: '15',
            endHour: '05',
            endMin: '45',
          },
        ],
      },
      {
        name: 'with clock-minute notation',
        input: 'sprint :15',
        tags: [ 'clock-notation' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '15',
            endMin: '45',
          },
          {
            calledAtHour: '04',
            calledAtMin: '21',
            calledAtSec: '47.792',
            startHour: '05',
            startMin: '15',
            endHour: '05',
            endMin: '45',
          },
        ],
      },
      {
        name: 'deceptive negatives',
        input: 'sprint -15',
        tags: [ 'confusing' ],
        tests: [
          {
            calledAtMin: '00',
            startMin: '15',
            endMin: '45',
          },
        ],
      },
    ],
  },
]
