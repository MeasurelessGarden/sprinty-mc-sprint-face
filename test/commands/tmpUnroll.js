var _ = require('lodash')
import {unroll} from '../spec.js'
import {sprintCommands} from '../../src/commands/sprintCommand.js'
import {createObjFromMessage} from '../../src/utils/parseUtils.js'
import {expect} from 'chai'

const exampleDate = (hour, min) => {
  return new Date(Date.parse(`2018-04-07T${hour}:${min}:00.000Z`))
}

const expectedSprint = test => {
  return {
    start: exampleDate(test.startHour ? test.startHour : '00', test.startMin),
    end: exampleDate(test.endHour ? test.endHour : '00', test.endMin),
  }
}

const unrolledExamples = _.flatMap(sprintCommands, command => {
  return _.flatMap(command.examples, example => {
    return _.map(example.tests, test => {
      return [
        // calledAt date is the zeroth hour of the day, to make the startHour, endHour easy to predict from example definitions
        command,
        example.tags,
        example.input,
        exampleDate('00', test.calledAtMin),
        expectedSprint(test),
      ]
    })
  })
})
const unrolledExamplesWithHeader = _.concat(
  [ [ 'command', 'tags', 'input', 'calledAt', 'expected' ] ],
  unrolledExamples
)

// console.log('-------------------')
// console.log('-------------------')
// console.log('-------------------')
// _.each(unrolledExamples, ex => {
//   console.log(ex)
// })
// console.log('-------------------')
// console.log('-------------------')
// console.log('-------------------')

describe('Parse Sprint Command', function(){
  describe('auto-generated tests vs single command and all sprint commands', function(){
    unroll(
      'creates sprint from #input using #command.vocabulary, #tags',
      function(done, args){
        const sprintFromVocabulary = createObjFromMessage(
          [ args.command ],
          args.input,
          args.calledAt
        )

        const sprintFromAllSprintCommands = createObjFromMessage(
          sprintCommands,
          args.input,
          args.calledAt
        )

        expect(sprintFromVocabulary).to.be.equalSprintDefinition(args.expected)
        expect(sprintFromAllSprintCommands).to.be.equalSprintDefinition(
          args.expected
        )
        done()
      },
      unrolledExamplesWithHeader
    )
  })
})
