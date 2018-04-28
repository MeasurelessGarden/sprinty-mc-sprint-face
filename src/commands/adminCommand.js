export const adminIntro =
  'Configure Sprinty. You must have permission to manage channels to use these commands!'

const showSprintChannelTemplate = {
  input: [],
  call: () => 'show',
  additionalHelp: 'Admins can show the current sprint channel.',
}

const configureSprintChannelTemplate = {
  input: [],
  call: () => 'configure', // TODO need some CONSTS for these!!
  additionalHelp: `Admins can configure the sprint channel, to prevent over-aggressive matching of potential commands during regular conversation elsewhere.
\t**Important:** You can pin this message, so the next time Sprinty loads, xe will reuse it. If more than one message is pinned, xe'll use the most recent one.`,
}

export const adminCommands = [
  // order is used to resolve commands without conflicts
  {
    vocabulary: [ [ 'show', 'what', 'which' ], [ 'sprint' ], [ 'channel' ] ],
    template: showSprintChannelTemplate,
    examples: [
      {
        name: 'straight-forward',
        input: 'show sprint channel',
        tags: [ 'basic' ],
      },
      {
        name: 'natural',
        input: 'which channel is the sprint channel?',
        tags: [ 'natural', 'alternate wording' ],
      },
      {
        name: 'natural',
        input: 'what is the sprint channel?',
        tags: [ 'natural' ],
      },
      {
        name: 'natural',
        input: 'show me the sprint channel',
        tags: [ 'natural' ],
      },
    ],
  },
  {
    vocabulary: [
      [ 'define', 'set', 'configure' ],
      [ 'sprint' ],
      [ 'channel' ],
    ],
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
      // {
      //   name: 'natural',
      //   input: "configure this as the sprint channel plz", // and 'configure sprint channel here bro'
      //   tags: [ 'natural' ],
      // },
    ],
  },
]
