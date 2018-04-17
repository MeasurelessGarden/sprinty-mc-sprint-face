var _ = require('lodash')
import {unroll} from '../spec.js'
import {countCommands} from '../../src/commands/countCommand.js'
import {createObjFromMessage} from '../../src/utils/parseUtils.js'
import {expect} from 'chai'

// const exampleDateString = (hour, min, sec) => {
//   return `${hour ? hour : '00'}:${min}:${sec ? sec : '00.000'}`
// }
//
// const exampleDate = (hour, min, sec) => {
//   return Date.parse(`2018-04-07T${exampleDateString(hour, min, sec)}Z`)
// }
//
const expectedCount = test => {
  return {
    set: test.wordCount,
    type: 'word',
  }
}

const unrolledExamples = _.flatMap(countCommands, command => {
  return _.flatMap(command.examples, example => {
    return _.map(example.tests, test => {
      return [
        // calledAt date is the zeroth hour of the day, to make the startHour, endHour easy to predict from example definitions
        command,
        example.tags,
        example.input,
        // exampleDate(test.calledAtHour, test.calledAtMin, test.calledAtSec),
        // exampleDateString(
        //   test.calledAtHour,
        //   test.calledAtMin,
        //   test.calledAtSec
        // ),
        expectedCount(test),
      ]
    })
  })
})

const unrolledExamplesWithHeader = _.concat(
  [ [ 'command', 'tags', 'input', 'expected' ] ],
  unrolledExamples
)

const unrollUntestedExamples = _.filter(
  _.flatMap(countCommands, command => {
    // TODO import as testCommands or something ....
    return _.map(command.examples, example => {
      if (!example.tests) {
        console.log('????', example)
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
        const countFromVocabulary = createObjFromMessage(
          // TODO sprintFromVocabulary is weird bc it's not a sprint, it's a sprintCommandResolved or something, but whatever
          [ args.command ],
          args.input,
          1523059200000
        )

        const countFromAllCommands = createObjFromMessage(
          countCommands,
          args.input,
          1523059200000
        )

        /*
        Verifies that these examples are matching this specific command.
        Also verifies that even if another command matches it -
        it produces the same result (as long as they parse it the same).
        */
        expect(countFromVocabulary).to.be.deep.equals(args.expected)
        expect(countFromAllCommands).to.be.deep.equals(args.expected)
        done()
      },
      unrolledExamplesWithHeader
    )
  })
})
