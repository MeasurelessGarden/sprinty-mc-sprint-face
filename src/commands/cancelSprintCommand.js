export const cancelSprintIntro = `Stop an existing sprint.`

const CancelSprintTemplate = {
  input: [],
  call: (...args) => {
    return true
  }, // ????
  additionalHelp: "There's not much to cancelling sprints.",
}

export const cancelSprintCommands = [
  // order is used to resolve commands without conflicts
  {
    vocabulary: [
      [ 'cancel', 'stop' ],
      [ 'sprint' ],
      // TODO note, regardless of overall command order, 'stop sprint at 30' is ambiguous..... maybe I need a thing to resolve if different commands respond to the same trigger, (or diff vocab results within the same command....)
    ],
    template: CancelSprintTemplate,
    examples: [
      {
        name: 'straight-forward',
        input: 'cancel sprint',
      },
      {
        name: 'straight-forward',
        input: 'stop sprint',
      },
      {
        name: 'natural',
        input: "plz stop the sprint i can't take it!!!",
      },
    ],
  },
]
