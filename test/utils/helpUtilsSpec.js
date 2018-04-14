var _ = require('lodash')
import {unroll} from '../spec.js'
import {expect} from 'chai'
import {
  substituteInputParamsForHelp,
  generateHelpForCommands,
  generateHelp,
  listExamples,
  generateExamplesForCommands,
  generateExamples,
} from '../../src/utils/helpUtils.js'

const simpleCommand = {
  vocabulary: [ [ 'simple' ], 'Number' ],
  template: {
    input: [
      {
        name: 'input num',
        type: 'Number',
        units: 'minutes',
        description: 'cannot be negative',
      },
    ],
    additionalHelp: 'additional info',
  },
  examples: [
    {
      name: 'exact',
      input: 'simple 3',
    },
    {
      name: 'verbose',
      input: 'a simple example with num 3',
    },
  ],
}

const twoArgCommand = {
  vocabulary: [ [ 'simple' ], 'Number', [ 'and' ], 'Number' ],
  template: {
    input: [
      {
        name: 'big num',
        type: 'Number',
        units: 'measurement',
        description: 'must be at least 100',
      },
      {
        name: 'value',
        type: 'Number',
        units: 'counts',
        description: 'cannot be negative',
      },
    ],
    additionalHelp:
      'There are two inputs, with different validation requirements.',
  },
  examples: [
    {
      name: 'exact',
      input: 'simple 100 and 5',
    },
  ],
}

// const altSpellingCommand = { // TODO add this + some examples for it to the tests...
//   vocabulary: [ ['simple', 'alt'], ['Number'], ['and', 'or'], ['Number'] ],
//   template: {
//     input: [
//       {
//         name: 'big num',
//         type: 'Number',
//         units: 'measurement',
//         description: 'must be at least 100',
//       },
//       {
//         name: 'value',
//         type: 'Number',
//         units: 'counts',
//         description: 'cannot be negative',
//       },
//     ],
//     additionalHelp:
//       'There are two inputs, with different validation requirements.',
//   },
//   examples: [
//     {
//       name: 'exact',
//       input: 'simple 100 and 5', // TODO alt examples...
//     },
//   ],
// }

describe('Help Utils', function(){
  describe('generateHelp', function(){
    it('generates a message with a header', function(){
      const help = generateHelp(null, 'Intro Text Here', [
        twoArgCommand,
        simpleCommand,
      ])
      expect(_.join(help, '\n\n')).to.be.equals(`Intro Text Here

commands:

simple [INPUT NUM]
\tINPUT NUM (minutes) - cannot be negative
\tadditional info

simple [BIG NUM] and [VALUE]
\tBIG NUM (measurement) - must be at least 100
\tVALUE (counts) - cannot be negative
\tThere are two inputs, with different validation requirements.`)
    })
  })

  describe('generateHelpForCommands', function(){
    it('generates a formatted help message', function(){
      const help = generateHelpForCommands([ twoArgCommand, simpleCommand ])
      expect(_.join(help, '\n\n')).to.be.equals(`simple [INPUT NUM]
\tINPUT NUM (minutes) - cannot be negative
\tadditional info

simple [BIG NUM] and [VALUE]
\tBIG NUM (measurement) - must be at least 100
\tVALUE (counts) - cannot be negative
\tThere are two inputs, with different validation requirements.`)
    })
  })

  describe('substituteInputParamsForHelp', function(){
    it('does not mutate the command', function(){
      substituteInputParamsForHelp(simpleCommand)
      expect(simpleCommand.vocabulary).to.deep.equals([
        [ 'simple' ],
        'Number',
      ])
    })

    unroll(
      'generates help message for #command',
      function(done, args){
        const help = substituteInputParamsForHelp(args.command)
        expect(help).to.be.deep.equals(args.expected)
        done()
      },
      [
        [ 'command', 'expected' ],
        [
          simpleCommand,
          [
            'simple [INPUT NUM]',
            'INPUT NUM (minutes) - cannot be negative',
            'additional info',
          ],
        ],
        [
          twoArgCommand,
          [
            'simple [BIG NUM] and [VALUE]',
            'BIG NUM (measurement) - must be at least 100',
            'VALUE (counts) - cannot be negative',
            'There are two inputs, with different validation requirements.',
          ],
        ],
      ]
    )
  })

  describe('generateExamples', function(){
    it('generates examples for all the commands', function(){
      const help = generateExamples('command name', null, [
        twoArgCommand,
        simpleCommand,
      ])
      expect(_.join(help, '\n\n')).to.be.equals(`command name examples:

simple [INPUT NUM]
\t\`simple 3\` - exact
\t\`a simple example with num 3\` - verbose

simple [BIG NUM] and [VALUE]
\t\`simple 100 and 5\` - exact`)
    })
  })

  describe('generateExamplesForCommands', function(){
    it('generates a formatted help message', function(){
      const help = generateExamplesForCommands([ twoArgCommand, simpleCommand ])
      expect(_.join(help, '\n\n')).to.be.equals(`simple [INPUT NUM]
\t\`simple 3\` - exact
\t\`a simple example with num 3\` - verbose

simple [BIG NUM] and [VALUE]
\t\`simple 100 and 5\` - exact`)
    })
  })

  describe('listExamples', function(){
    unroll(
      'generates examples for #command',
      function(done, args){
        const examples = listExamples(args.command)
        expect(examples).to.be.deep.equals(args.expected)
        done()
      },
      [
        [ 'command', 'expected' ],
        [
          simpleCommand,
          [
            'simple [INPUT NUM]',
            '`simple 3` - exact',
            '`a simple example with num 3` - verbose',
          ],
        ],
        [
          twoArgCommand,
          [ 'simple [BIG NUM] and [VALUE]', '`simple 100 and 5` - exact' ],
        ],
      ]
    )
  })
})
