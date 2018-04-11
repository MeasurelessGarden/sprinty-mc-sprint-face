var _ = require('lodash')
import {unroll} from '../spec.js'
import {sprintCommands} from '../../src/commands/sprintCommand.js'
import {createObjFromMessage} from '../../src/utils/parseUtils.js'
import {expect} from 'chai'

const exampleDate = (hour, min, sec) => {
  return new Date(
    Date.parse(
      `2018-04-07T${hour ? hour : '00'}:${min}:${sec ? sec : '00.000'}Z`
    )
  )
}

const expectedSprint = test => {
  return {
    start: exampleDate(test.startHour, test.startMin),
    end: exampleDate(test.endHour, test.endMin),
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
        exampleDate(test.calledAtHour, test.calledAtMin, test.calledAtSec),
        expectedSprint(test),
      ]
    })
  })
})

const unrolledExamplesWithHeader = _.concat(
  [ [ 'command', 'tags', 'input', 'calledAt', 'expected' ] ],
  unrolledExamples
)

const unrolledInvalidExamples = _.flatMap(sprintCommands, command => {
  return _.map(command.invalidExamples, invalid => {
    return [ command, invalid ]
  })
})

const unrolledInvalidExamplesWithHeader = _.concat(
  [ [ 'command', 'input' ] ],
  unrolledInvalidExamples
)

describe('Parse Sprint Command', function(){
  describe('auto-generated invalid input', function(){
    unroll(
      'invalid sprint from #input using #command.vocabulary',
      function(done, args){
        const sprintFromVocabulary = createObjFromMessage(
          [ args.command ],
          args.input,
          1522815707792
        )

        const sprintFromAllSprintCommands = createObjFromMessage(
          sprintCommands,
          args.input,
          1522815707792
        )

        expect(sprintFromVocabulary).to.be.undefined
        expect(sprintFromAllSprintCommands).to.be.undefined
        done()
      },
      unrolledInvalidExamplesWithHeader
    )
  })

  describe('auto-generated tests vs single command and all sprint commands', function(){
    unroll(
      'creates sprint from #input using #command.vocabulary, #tags (when called at #calledAt)',
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

        /*
        Verifies that these examples are matching this specific command.
        Also verifies that even if another command matches it -
        it produces the same sprint (as long as they parse it the same).
        */
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
