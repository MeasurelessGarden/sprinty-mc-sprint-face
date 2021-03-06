import {generateHelp, generateExamples} from '../utils/helpUtils.js'
import {
  isValidCommandName,
  validCommandsString,
  generate,
} from '../utils/commandUtils.js'

export const TESTS = {
  SPRINT: 17,
  ADMIN: 4,
  COUNT: 7,
  HELP: 7,
  VERSION: 1,
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
  description: `must be one of: ${validCommandsString}`,
  checks: [ arg => isValidCommandName(arg) ], //
  // TODO 'help' cannot be a standard command name, since it confuses the parser with 'help help'
}

export const BasicHelpTemplate = {
  // exact: true, // TODO need to figure out how to test this - for now, it'll just depend on the same matching everything else does
  input: [],
  call: () => generateHelp('help', helpIntro, helpCommands),
  additionalHelp:
    '(bet you figured out this one!) Please always ask for help in a DM to Sprinty.',
}

const CommandHelpTemplate = {
  // exact: true,
  input: [ CommandInput ],
  call: command => generate(command, generateHelp),
  additionalHelp:
    'Get more info on running commands. This command must be in a DM.',
}

const CommandHelpExamplesTemplate = {
  input: [ CommandInput ],
  call: command => generate(command, generateExamples),
  additionalHelp: 'Get examples for commands. This command must be in a DM.',
}

const HelpExamplesTemplate = {
  input: [],
  call: () => generateExamples('help', helpIntro, helpCommands),
  additionalHelp: 'Get examples. This command must be in a DM.',
}

const VersionTemplate = {
  input: [],
  call: () => [
    `Currently running version: ${process.env.SPRINTY_VERSION || 'undefined'}`,
  ],
  additionalHelp: 'Get the current version of Sprinty.',
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
        tests: [ {instructions: TESTS.SPRINT - 1} ],
      },
      {
        name: 'straight-forward',
        input: 'help sprint example',
        tags: [ 'basic', 'alternate wording' ],
        tests: [ {instructions: TESTS.SPRINT - 1} ],
      },
      {
        name: 'straight-forward',
        input: 'show sprint examples',
        tags: [ 'basic', 'alternate wording' ],
        tests: [ {instructions: TESTS.SPRINT - 1} ],
      },
      {
        name: 'natural',
        input: 'show me some sprint examples',
        tags: [ 'natural' ],
        tests: [ {instructions: TESTS.SPRINT - 1} ],
      },
      {
        name: 'admin examples',
        input: 'show me some admin examples',
        tags: [ 'natural' ],
        tests: [ {instructions: TESTS.ADMIN - 1} ],
      },
      {
        name: 'admin examples',
        input: 'help admin example',
        tags: [ 'basic' ],
        tests: [ {instructions: TESTS.ADMIN - 1} ],
      },
      {
        name: 'word count examples',
        input: 'show me word count examples',
        tags: [ 'natural' ],
        tests: [ {instructions: TESTS.COUNT - 1} ],
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
        tests: [ {instructions: TESTS.HELP - 1} ],
      },
      {
        name: 'straight-forward',
        input: 'help example',
        tags: [ 'basic', 'alternate wording' ],
        tests: [ {instructions: TESTS.HELP - 1} ],
      },
      {
        name: 'straight-forward',
        input: 'show examples',
        tags: [ 'basic', 'alternate wording' ],
        tests: [ {instructions: TESTS.HELP - 1} ],
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
        tests: [ {instructions: TESTS.SPRINT} ],
      },
      {
        name: 'word count',
        input: 'help me with my word count',
        tags: [ 'natural' ],
        tests: [ {instructions: TESTS.COUNT} ],
      },
      {
        name: 'sprint natural',
        input: 'help me create a sprint',
        tags: [ 'natural' ],
        tests: [ {instructions: TESTS.SPRINT} ],
      },
      {
        name: 'admin',
        input: 'help admin',
        tags: [ 'basic' ],
        tests: [ {instructions: TESTS.ADMIN} ],
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
        tests: [ {instructions: TESTS.HELP} ],
      },
      {
        name: 'natural inquery',
        input: 'will u help me?',
        tags: [ 'natural' ],
        tests: [ {instructions: TESTS.HELP} ],
      },
      {
        name: 'natural',
        input: 'help me plz',
        tests: [ {instructions: TESTS.HELP} ],
      },
      {
        name: 'natural insistant',
        input: 'YO HELP',
        tags: [ 'natural' ],
        tests: [ {instructions: TESTS.HELP} ],
      },
    ],
  },

  {
    vocabulary: [ [ [ 'version' ] ] ],
    template: VersionTemplate,
    examples: [
      {
        name: 'basic',
        input: 'version',
        tags: [ 'basic' ],
        tests: [ {instructions: TESTS.VERSION} ],
      },
      {
        name: 'natural inquery',
        input: 'what version are you running?',
        tags: [ 'natural' ],
        tests: [ {instructions: TESTS.VERSION} ],
      },
    ],
  },
]
