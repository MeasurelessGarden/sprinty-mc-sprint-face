import {generateHelp, generateExamples} from './helpUtils.js'

import {sprintIntro, sprintCommands} from './sprintCommand.js'

// TODO replace client id 430905454961623060 with a var
export const helpIntro = `**Welcome to Sprinty McSprintFace!**

First up: typing '<@430905454961623060> help' or 'help <@430905454961623060>' will make this goofy bot try to help you!

Note, for spam reasons, Sprinty will only reply to you in a DM! Please DM Sprinty directly instead of spamming a busy channel!

Xe acknowledges commands with reactions, so that's how you'll know if Sprinty heard you!

Sprinty parses many commands out of normally phrased text, so it's important to dig through the help and figure out how to say what you mean, and understand the places where xe can get it hilariously wrong.

Capitalization and punctation don't matter. Not to xem, anyway.`

export const BasicHelpTemplate = {
  // exact: true, // TODO need to figure out how to test this - for now, it'll just depend on the same matching everything else does
  input: [],
  call: (...args) => {
    return generateHelp(helpIntro, helpCommands)
  },
  additionalHelp:
    '(bet you figured out this one!) Please always ask for help in a DM to Sprinty.',
}

const CommandHelpTemplate = {
  // exact: true,
  input: [
    {
      name: 'command',
      type: 'Command', // TODO validate that a command cannot use this template unless it has the right args inside it (include default param - meaning not required for this, and also has a value)
      description: 'must be one of: sprint', // TODO this has some duplication in parseUtils for anything ever to work (for now)
      checks: [ arg => arg == 'sprint' ], // TODO 'help' cannot be a standard command name, since it confuses the parser with 'help help'
    },
  ],
  call: (...args) => {
    // TODO once we have more commands, this will have to look at arg[1] (arg[0] is timestamp) and switch on which intro/commands to put into the function.
    // I guess I could test it with `help help` ....
    return generateHelp(sprintIntro, sprintCommands)
  },
  additionalHelp:
    'Get more info on managing sprints. This command must be in a DM.', // TODO this message is sprint specific too - will need to change for when there are more commands supported
}

const CommandHelpExamplesTemplate = {
  input: [
    {
      name: 'command', // TODO pull out const input shared between commands....
      type: 'Command',
      description: 'must be one of: sprint',
      checks: [ arg => arg == 'sprint' ],
    },
  ],
  call: (...args) => {
    // TODO once we have more commands, this will have to look at arg[1] (arg[0] is timestamp) and switch on which intro/commands to put into the function.
    // I guess I could test it with `help help` ....
    return generateExamples('sprint', sprintCommands)
  },
  additionalHelp: 'Get examples for commands.',
}

const HelpExamplesTemplate = {
  input: [],
  call: (...args) => {
    return generateExamples('help', helpCommands)
  },
  additionalHelp: 'Get examples.',
}

export const helpCommands = [
  {
    vocabulary: [ [ 'help', 'show' ], 'Command', [ 'examples', 'example' ] ],
    template: CommandHelpExamplesTemplate,
    examples: [
      {name: 'straight-forward', input: 'help sprint examples'},
      {name: 'straight-forward', input: 'help sprint example'},
      {name: 'straight-forward', input: 'show sprint examples'},
    ],
  },
  {
    vocabulary: [ [ 'help', 'show' ], [ 'examples', 'example' ] ],
    template: HelpExamplesTemplate,
    examples: [
      {name: 'straight-forward', input: 'help examples'},
      {name: 'straight-forward', input: 'help example'},
      {name: 'straight-forward', input: 'show examples'},
    ],
  },
  // {
  //   vocabulary: [ 'help', 'COMMAND', 'list' ],
  //   template: HelpListTemplate,
  //   examples: [], // JSUT the commands, in a list, nothing extra // TODO if I do this, I should have more specific types than 'Number' like 'ClockMin' and 'DurationMin' .... or something?
  // },
  {
    vocabulary: [ [ 'help', 'halp' ], 'Command' ],
    template: CommandHelpTemplate,
    examples: [
      {
        name: 'sprint',
        // TODO flag these help: 'basic'?
        input: 'help sprint',
      },
      {
        name: 'sprint natural',
        input: 'help me create a sprint',
      },
      // TODO invalid: help with sprints
    ],
  },
  {
    vocabulary: [ [ [ 'help' ], [ 'halp' ] ] ], // TODO basically this is 'help COMMAND' where command defaults to 'help' - need to get a defaults mechanism to make it simpler to list command variations
    template: BasicHelpTemplate,
    examples: [
      {name: 'basic', input: 'help'},
      {name: 'natural inquery', input: 'will u help me?'},
      {name: 'natural', input: 'help me plz'},
      {name: 'natural insistant', input: 'YO HELP'},
    ],
    // examples: []
  },
]
