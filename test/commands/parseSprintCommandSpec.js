var _ = require('lodash')
import {unroll} from '../spec.js'
import {sprintCommands as testCommands} from '../../src/commands/sprintCommand.js'
import {createObjFromMessage} from '../../src/utils/parseUtils.js'
import {expect} from 'chai'

const exampleDateString = (hour, min, sec) => {
  return `${hour ? hour : '00'}:${min}:${sec ? sec : '00.000'}`
}

const exampleDate = (hour, min, sec) => {
  return Date.parse(`2018-04-07T${exampleDateString(hour, min, sec)}Z`)
}

const expectedSprint = test => {
  return {
    // TODO use new Sprint(x,y,z)???
    start: exampleDate(test.startHour, test.startMin),
    end: exampleDate(test.endHour, test.endMin),
  }
}

const unrolledExamples = _.flatMap(testCommands, command => {
  return _.flatMap(command.examples, example => {
    return _.map(example.tests, test => {
      return [
        // calledAt date is the zeroth hour of the day, to make the startHour, endHour easy to predict from example definitions
        command,
        example.tags,
        example.input,
        exampleDate(test.calledAtHour, test.calledAtMin, test.calledAtSec),
        exampleDateString(
          test.calledAtHour,
          test.calledAtMin,
          test.calledAtSec
        ),
        expectedSprint(test),
      ]
    })
  })
})

const unrolledExamplesWithHeader = _.concat(
  [ [ 'command', 'tags', 'input', 'calledAt', 'calledAtLabel', 'expected' ] ],
  unrolledExamples
)

const unrollCommandExamplesWithoutTests = _.filter(
  _.flatMap(testCommands, command => {
    return _.map(command.examples, example => {
      if (!example.tests) {
        const expected = command.template.additionalHelp.includes('cancel')
          ? 'cancel'
          : command.template.additionalHelp.includes('info')
            ? 'info'
            : undefined
        return [ command, example.input, expected ]
      }
    })
  }),
  it => it
)

const unrollCommandExamplesWithoutTestsWithHeader = _.concat(
  [ [ 'command', 'input', 'expected' ] ],
  unrollCommandExamplesWithoutTests
)

const unrolledInvalidExamples = _.flatMap(testCommands, command => {
  return _.map(command.invalidExamples, invalid => {
    return [ command, invalid ]
  })
})

const unrolledInvalidExamplesWithHeader = _.concat(
  [ [ 'command', 'input' ] ],
  unrolledInvalidExamples
)

describe('Parse Sprint Command', function(){
  describe('auto-generated commands with no automatic tests', function(){
    unroll(
      'creates a command from #input - expects #expected',
      function(done, args){
        const resultFromVocabulary = createObjFromMessage(
          // TODO resultFromVocabulary is weird bc it's not a sprint, it's a sprintCommandResolved or something, but whatever
          [ args.command ],
          args.input,
          1523059200000
        )

        const resultFromAllCommands = createObjFromMessage(
          testCommands,
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
      unrollCommandExamplesWithoutTestsWithHeader
    )
  })

  describe('auto-generated invalid input', function(){
    unroll(
      'invalid sprint from #input using #command.vocabulary',
      function(done, args){
        const resultFromVocabulary = createObjFromMessage(
          [ args.command ],
          args.input,
          1522815707792
        )

        const resultFromAllCommands = createObjFromMessage(
          testCommands,
          args.input,
          1522815707792
        )

        expect(resultFromVocabulary).to.be.undefined
        expect(resultFromAllCommands).to.be.undefined
        done()
      },
      unrolledInvalidExamplesWithHeader
    )
  })

  describe('auto-generated tests vs single command and all sprint commands', function(){
    unroll(
      'creates sprint from #input using #command.vocabulary, #tags (when called at #calledAtLabel)',
      function(done, args){
        const resultFromVocabulary = createObjFromMessage(
          [ args.command ],
          args.input,
          args.calledAt
        )

        const resultFromAllCommands = createObjFromMessage(
          testCommands,
          args.input,
          args.calledAt
        )

        /*
        Verifies that these examples are matching this specific command.
        Also verifies that even if another command matches it -
        it produces the same sprint (as long as they parse it the same).
        */
        expect(resultFromVocabulary).to.be.equalSprintDefinition(args.expected)
        expect(resultFromAllCommands).to.be.equalSprintDefinition(args.expected)
        done()
      },
      unrolledExamplesWithHeader
    )
  })
})
