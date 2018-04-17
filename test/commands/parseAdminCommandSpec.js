var _ = require('lodash')
import {unroll} from '../spec.js'
import {adminCommands} from '../../src/commands/adminCommand.js'
import {createObjFromMessage} from '../../src/utils/parseUtils.js'
import {expect} from 'chai'

const unrollCommandExamples = _.flatMap(adminCommands, command => {
  return _.map(command.examples, example => {
    const expected = command.template.additionalHelp.includes('show')
      ? 'show'
      : command.template.additionalHelp.includes('configure')
        ? 'configure'
        : undefined
    return [ command, example.input, expected ]
  })
})

const unrollCommandExamplesWithHeader = _.concat(
  [ [ 'command', 'input', 'expected' ] ],
  unrollCommandExamples
)

// technically all admin commands are "untested" because there's really no input to test - it's all determined by the weird test logic above that assumes from the template what the result should be
// const unrollUntestedExamples = _.filter(
//   _.flatMap(adminCommands, command => {
//     return _.map(command.examples, example => {
//       if (!example.tests) {
//         return [ command, example.input ]
//       }
//     })
//   }),
//   it => it
// )

describe('Parse Admin Command', function(){
  describe('auto-generated commands', function(){
    // it('has no untested examples', function(){
    //   expect(unrollUntestedExamples.length).to.be.equal(0)
    // })

    unroll(
      'creates a command from #input - expects #expected',
      function(done, args){
        const resultFromVocabulary = createObjFromMessage(
          [ args.command ],
          args.input,
          1523059200000
        )

        const resultFromAllCommands = createObjFromMessage(
          adminCommands,
          args.input,
          1523059200000
        )

        /*
        Verifies that these examples are matching this specific command.
        Also verifies that even if another command matches it -
        it produces the same result (as long as they parse it the same).
        */
        expect(resultFromVocabulary).to.be.equals(args.expected)
        expect(resultFromAllCommands).to.be.equals(args.expected)
        done()
      },
      unrollCommandExamplesWithHeader
    )
  })
})
