import {unroll} from '../spec.js'
import {expect} from 'chai'
import {
  substituteInputParamsForHelp,
  generateHelpForCommands,
  generateHelp,
} from '../../src/commands/helpUtils.js'

const simpleCommand = {
  vocabulary: [ 'simple', 'Number' ],
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
    // examples: [],
  },
}

const twoArgCommand = {
  vocabulary: [ 'simple', 'Number', 'and', 'Number' ],
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
    // examples: [],
  },
}

describe('Help Utils', function(){
  describe('generateHelp', function(){
    it('generates a message with a header', function(){
      const help = generateHelp('Intro Text Here', [
        simpleCommand,
        twoArgCommand,
      ])
      expect(help).to.be.equals(`Intro Text Here

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
      const help = generateHelpForCommands([ simpleCommand, twoArgCommand ])
      expect(help).to.be.equals(`simple [INPUT NUM]
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
      expect(simpleCommand.vocabulary).to.deep.equals([ 'simple', 'Number' ])
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
})
