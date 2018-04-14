export const configureSprintChannelIntro = 'Set the sprint channel.'

const configureSprintChannelTemplate = {
  input: [],
  call: (...args) => {
    return 'configure' // TODO need some CONSTS for these!!
  },
  additionalHelp:
    'Admins can set the sprint channel, to prevent over-aggressive matching of potential commands during regular conversation elsewhere.',
}

export const configureSprintChannelCommands = [
  // order is used to resolve commands without conflicts
  {
    vocabulary: [ [ 'define', 'set' ], [ 'sprint' ], [ 'channel' ] ],
    template: configureSprintChannelTemplate,
    examples: [
      {
        name: 'straight-forward',
        input: 'define sprint channel',
      },
      {
        name: 'natural',
        input: 'set the sprint channel here',
      },
      {
        name: 'natural',
        input: "this is set as Sprinty's sprint channel",
      },
    ],
  },
]
