export const sprintInfoIntro = 'Query what sprint is configured.'

const SprintInfoTemplate = {
  input: [],
  call: (...args) => {
    return true
  }, // ????
  additionalHelp: 'Get the current sprint information.',
}

export const sprintInfoCommands = [
  // order is used to resolve commands without conflicts
  {
    vocabulary: [ [ 'sprint' ], [ 'info' ] ],
    template: SprintInfoTemplate,
    examples: [
      {
        name: 'straight-forward',
        input: 'sprint info',
      },
      {
        name: 'natural',
        input: 'gimme the sprint info plz~!!',
      },
    ],
  },
]
