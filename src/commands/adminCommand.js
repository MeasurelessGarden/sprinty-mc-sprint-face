export const adminIntro = 'Configure Sprinty.'

const configureSprintChannelTemplate = {
  input: [],
  call: (...args) => {
    return 'configure' // TODO need some CONSTS for these!!
  },
  additionalHelp:
    'Admins can set the sprint channel, to prevent over-aggressive matching of potential commands during regular conversation elsewhere.',
}

export const adminCommands = [
  // order is used to resolve commands without conflicts
  {
    vocabulary: [ [ 'define', 'set' ], [ 'sprint' ], [ 'channel' ] ],
    template: configureSprintChannelTemplate,
    examples: [
      {
        name: 'straight-forward',
        input: 'define sprint channel',
        tags: [ 'basic' ],
      },
      {
        name: 'natural',
        input: 'set the sprint channel here',
        tags: [ 'natural', 'alternate wording' ],
      },
      {
        name: 'natural',
        input: "this is set as Sprinty's sprint channel",
        tags: [ 'natural' ],
      },
    ],
  },
]
