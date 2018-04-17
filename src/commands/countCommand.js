import {SetCount} from '../utils/countGenerator.js'
export const countIntro = 'Track wordcounts.'

/*
what is my count now?
set my count to NNN
add XYZ to my count
i got NNN
i finished with XYZ
i have XYZ
wc NNN

"new words" "final words"?
300 new words -> adds to total count
final words / total words  -> set total

i wrote XYZ!!!
*/

const CountInput = countType => {
  return {
    name: `${countType} count`,
    type: 'Number', // TODO validate that a command cannot use this template unless it has the right args inside it (include default param - meaning not required for this, and also has a value)
    units: `${countType}s`,
    description: 'must be >= 0',
    checks: [ arg => arg >= 0 ],
  }
}

const WordCountTemplate = {
  input: [ CountInput('word') ],
  call: (...args) => {
    return new SetCount(args[1], 'word')
  },
  additionalHelp: 'Set your current word count.',
}

export const countCommands = [
  // order is used to resolve commands without conflicts
  {
    vocabulary: [ [ 'wc' ], 'Number' ],
    template: WordCountTemplate,
    examples: [
      {
        name: 'straight-forward',
        input: 'wc 230',
        tags: [ 'literal', 'basic' ],
        tests: [
          {
            previousCount: undefined,
            wordCount: 230,
          },
          {
            // previousTime: '2018-04-15T05:30:00',
            // previousCount: 20,
            // calledTime: '2018-04-15T06:00:00',
            wordCount: 230,
            // diff: 210,
            // duration: '30 minutes',
          },
          {
            // previousTime: '2018-04-1505:30:00',
            // previousCount: 100,
            // calledTime: '2018-04-16T06:00:00',
            wordCount: 230,
            // diff: 130,
            // duration: 'since yesterday',
          },
        ],
      },
      {
        name: 'natural',
        input: 'I think my wc is 400 rn',
        tags: [ 'natural' ],
        tests: [
          {
            // previousCount: undefined,
            wordCount: 400,
          },
          {
            // previousCount: 1000,
            wordCount: 400,
            // diff: -600,
          },
        ],
      },
    ],
    // TODO invalidExamples: [],
  },
]
