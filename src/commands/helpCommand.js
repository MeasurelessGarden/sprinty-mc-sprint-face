import {
  generateHelp,
} from './helpUtils.js'

import {sprintIntro, sprintCommands} from './sprintCommand.js'

// TODO replace client id 430905454961623060 with a var
export const helpIntro = `**Welcome to Sprinty McSprintFace!**

First up: typing '<@430905454961623060> help' or 'help <@430905454961623060>' will make this goofy bot try to help you!

Note, for spam reasons, Sprinty will only reply to you in a DM! Please DM Sprinty directly instead of spamming a busy channel!

Xe acknowledges commands with reactions, so that's how you'll know if Sprinty heard you!

Sprinty parses many commands out of normally phrased text, so it's important to dig through the help and figure out how to say what you mean, and understand the places where xe can get it hilariously wrong.`
// Here's some basic commands to get you started:
//
// - \`help\` (bet you figured out this one!)
// - \`help sprint\` - get more info on managing sprints
// - \`help sprint examples\` - because of the command matching, this is extensive, which is \`help sprint\` exists to just list the options consisely.
// `

const BasicHelpTemplate = {
  exact: true, // TODO need to figure out how to test this
  input: [],
  call: (...args) => {
    return generateHelp(helpIntro, helpCommands) //TODO have a feeling I'm going to get into a which-is-defined-first loop :(
  },
  additionalHelp:
    '(bet you figured out this one!) Please always ask for help in a DM to Sprinty.',
}

const CommandHelpTemplate = {
  exact: true, // TODO need to figure out how to test this
  input: [
    {
      name: 'command',
      type: 'Command', // TODO validate that a command cannot use this template unless it has the right args inside it (include default param - meaning not required for this, and also has a value)
      // units: 'minutes of hour',
      description: 'must be one of: sprint',
      checks: [ arg => arg == 'sprint' ],
    },
  ],
  call: (...args) => {
    // TODO once we have more commands, this will have to look at arg[1] (arg[0] is timestamp) and switch on which intro/commands to put into the function.
    // I guess I could test it with `help help` ....
    console.log('wtf', sprintIntro)
    return generateHelp(sprintIntro, sprintCommands)
  },
  additionalHelp:
    'Get more info on managing sprints.',
}

export const helpCommands = [

    {
      vocabulary: [ 'help', 'Command' ],
      template: CommandHelpTemplate,
      examples: [  {
          name: 'sprint',
           // TODO flag these help: 'basic'?
          input: 'help sprint',
        },]
    },
  {
    vocabulary: [ 'help' ],
    template: BasicHelpTemplate,
    // examples: []
  },
    //help command examples - allows 'help help examples'
]
