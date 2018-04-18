var _ = require('lodash')
import {unroll} from '../spec.js'
import {countCommands as testCommands} from '../../src/commands/countCommand.js'
import {createObjFromMessage} from '../../src/utils/parseUtils.js'
import {expect} from 'chai'

const expectedCount = test => {
  return {
    ...{
      count: test.wordCount,
      type: 'word',
    },
    ...(test.delta ? {delta: test.delta} : {}),
  }
}

const unrolledExamples = _.flatMap(testCommands, command => {
  return _.flatMap(command.examples, example => {
    return _.map(example.tests, test => {
      return [
        command,
        example.tags,
        example.input,
        test.previous,
        expectedCount(test),
      ]
    })
  })
})

const unrolledExamplesWithHeader = _.concat(
  [ [ 'command', 'tags', 'input', 'previousCount', 'expected' ] ],
  unrolledExamples
)

const unrollUntestedExamples = _.filter(
  _.flatMap(testCommands, command => {
    return _.map(command.examples, example => {
      if (!example.tests) {
        return [ command, example.input ]
      }
    })
  }),
  it => it
)

describe('Parse Count Command', function(){
  describe('auto-generated commands', function(){
    it('has no untested examples', function(){
      expect(unrollUntestedExamples.length).to.be.equal(0)
    })

    unroll(
      'creates a command from #input - expects #expected',
      function(done, args){
        const resultFromVocabulary = createObjFromMessage(
          [ args.command ],
          args.input,
          args.previousCount
        )

        const resultFromAllCommands = createObjFromMessage(
          testCommands,
          args.input,
          args.previousCount
        )

        /*
        Verifies that these examples are matching this specific command.
        Also verifies that even if another command matches it -
        it produces the same result (as long as they parse it the same).
        */
        expect(resultFromVocabulary).to.be.deep.equals(args.expected)
        expect(resultFromAllCommands).to.be.deep.equals(args.expected)
        done()
      },
      unrolledExamplesWithHeader
    )
  })
})
