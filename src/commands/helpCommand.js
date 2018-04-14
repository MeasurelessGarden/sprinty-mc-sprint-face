import {generateHelp, generateExamples} from '../utils/helpUtils.js'
import {sprintIntro, sprintCommands} from './sprintCommand.js'
import {adminIntro, adminCommands} from './adminCommand.js'

const COMMAND_LOOKUP = {
  sprint: {intro: sprintIntro, commands: sprintCommands},
  admin: {intro: adminIntro, commands: adminCommands},
}

// TODO replace client id 430905454961623060 with a var
export const helpIntro = `**Welcome to Sprinty McSprintFace!**

First up: typing '<@430905454961623060> help' or 'help <@430905454961623060>' will make this goofy bot try to help you!

Note, for spam reasons, Sprinty will only reply to you in a DM! Please DM Sprinty directly instead of spamming a busy channel!

Xe acknowledges commands with reactions, so that's how you'll know if Sprinty heard you!

Sprinty parses many commands out of normally phrased text, so it's important to dig through the help and figure out how to say what you mean, and understand the places where xe can get it hilariously wrong.

Capitalization and punctation don't matter. Not to xem, anyway.`

const CommandInput = {
  name: 'command',
  type: 'Command', // TODO validate that a command cannot use this template unless it has the right args inside it (include default param - meaning not required for this, and also has a value)
  description: 'must be one of: sprint, admin', // TODO this has some duplication in parseUtils for anything ever to work (for now)
  checks: [ arg => arg == 'sprint' || arg == 'admin' ], // TODO 'help' cannot be a standard command name, since it confuses the parser with 'help help'
}

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
  input: [ CommandInput ],
  call: (...args) => {
    // TODO once we have more commands, this will have to look at arg[1] (arg[0] is timestamp) and switch on which intro/commands to put into the function.
    // I guess I could test it with `help help` ....
    const command = COMMAND_LOOKUP[args[1]]
    return generateHelp(command.intro, command.commands)
  },
  additionalHelp:
    'Get more info on running commands. This command must be in a DM.',
}

const CommandHelpExamplesTemplate = {
  input: [ CommandInput ],
  call: (...args) => {
    // TODO once we have more commands, this will have to look at arg[1] (arg[0] is timestamp) and switch on which intro/commands to put into the function.
    // I guess I could test it with `help help` ....
    const command = COMMAND_LOOKUP[args[1]]
    return generateExamples(args[1], command.commands)
  },
  additionalHelp: 'Get examples for commands. This command must be in a DM.',
}

const HelpExamplesTemplate = {
  input: [],
  call: (...args) => {
    return generateExamples('help', helpCommands)
  },
  additionalHelp: 'Get examples. This command must be in a DM.',
}

export const helpCommands = [
  {
    vocabulary: [ [ 'help', 'show' ], 'Command', [ 'examples', 'example' ] ],
    template: CommandHelpExamplesTemplate,
    examples: [
      {
        name: 'straight-forward',
        input: 'help sprint examples',
        tags: [ 'basic' ],
        tests: [ {instructions: 16} ],
      },
      {
        name: 'straight-forward',
        input: 'help sprint example',
        tags: [ 'basic', 'alternate wording' ],
        tests: [ {instructions: 16} ],
      },
      {
        name: 'straight-forward',
        input: 'show sprint examples',
        tags: [ 'basic', 'alternate wording' ],
        tests: [ {instructions: 16} ],
      },
      {
        name: 'natural',
        input: 'show me some sprint examples',
        tags: [ 'natural' ],
        tests: [ {instructions: 16} ],
      },
      {
        name: 'admin examples',
        input: 'show me some admin examples',
        tags: [ 'natural' ],
        tests: [ {instructions: 2} ],
      },
      {
        name: 'admin examples',
        input: 'help admin example',
        tags: [ 'basic' ],
        tests: [ {instructions: 2} ],
      },
    ],
  },
  {
    vocabulary: [ [ 'help', 'show' ], [ 'examples', 'example' ] ],
    template: HelpExamplesTemplate,
    examples: [
      {
        name: 'straight-forward',
        input: 'help examples',
        tags: [ 'basic' ],
        tests: [ {instructions: 5} ],
      },
      {
        name: 'straight-forward',
        input: 'help example',
        tags: [ 'basic', 'alternate wording' ],
        tests: [ {instructions: 5} ],
      },
      {
        name: 'straight-forward',
        input: 'show examples',
        tags: [ 'basic', 'alternate wording' ],
        tests: [ {instructions: 5} ],
      },
    ],
  },
  // {
  //   vocabulary: [ 'help', 'COMMAND', 'list' ],
  //   template: HelpListTemplate,
  //   examples: [], // JSUT the commands, in a list, nothing extra // TODO if I do this, I should have more specific types than 'Number' like 'ClockMin' and 'DurationMin' .... or something?
  // },

  {
    // TODO a fun alternate would be: tell me about Command
    vocabulary: [ [ 'help', 'halp' ], 'Command' ],
    template: CommandHelpTemplate,
    examples: [
      {
        name: 'sprint',
        input: 'help sprint',
        tags: [ 'basic' ],
        tests: [ {instructions: 17} ],
      },
      {
        name: 'sprint natural',
        input: 'help me create a sprint',
        tags: [ 'natural' ],
        tests: [ {instructions: 17} ],
      },
      {
        name: 'admin',
        input: 'help admin',
        tags: [ 'basic' ],
        tests: [ {instructions: 3} ],
      },
      // TODO invalid: help with sprints
    ],
  },
  {
    vocabulary: [ [ [ 'help' ], [ 'halp' ] ] ], // TODO basically this is 'help COMMAND' where command defaults to 'help' - need to get a defaults mechanism to make it simpler to list command variations
    template: BasicHelpTemplate,
    examples: [
      {
        name: 'basic',
        input: 'help',
        tags: [ 'basic' ],
        tests: [ {instructions: 6} ],
      },
      {
        name: 'natural inquery',
        input: 'will u help me?',
        tags: [ 'natural' ],
        tests: [ {instructions: 6} ],
      },
      {name: 'natural', input: 'help me plz', tests: [ {instructions: 6} ]},
      {
        name: 'natural insistant',
        input: 'YO HELP',
        tags: [ 'natural' ],
        tests: [ {instructions: 6} ],
      },
    ],
  },
]
