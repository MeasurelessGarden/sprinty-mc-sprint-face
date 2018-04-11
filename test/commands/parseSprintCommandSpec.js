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

        expect(sprintFromVocabulary).to.be.equalSprintDefinition(args.expected)
        expect(sprintFromAllSprintCommands).to.be.equalSprintDefinition(
          args.expected
        )
        done()
      },
      unrolledExamplesWithHeader
    )
  })

  unroll(
    'validates a sprint to control length #message - #reason',
    function(done, args){
      const sprint = createObjFromMessage(
        sprintCommands,
        args.message,
        1522815707792
      )
      if (args.expected) {
        expect(sprint).to.be.equalSprintDefinition(args.expected)
      }
      else {
        expect(sprint).to.be.undefined
      }
      done()
    },
    [
      [ 'reason', 'message', 'expected' ],
      [
        'an hour is allowed',
        'sprint at 10 for 60', // in example: check
        {
          start: new Date(Date.parse('2018-04-04T05:10:00.000Z')),
          end: new Date(Date.parse('2018-04-04T06:10:00.000Z')),
        },
      ],
      [
        'sprints cannot be longer than an hour',
        'sprint at 10 for 61', // TODO add all the undefineds to 'invalid tests'
        undefined,
      ],
      [
        'sprints of no length make zero sense',
        'sprint at 10 for 0',
        undefined,
      ],
      [
        'sprints of 1 minute are ok',
        'sprint at 10 for 1', // in example: check
        {
          start: new Date(Date.parse('2018-04-04T05:10:00.000Z')),
          end: new Date(Date.parse('2018-04-04T05:11:00.000Z')),
        },
      ],
      [
        'sprints of 1 minute can be defined multiple ways',
        'sprint at 10 to 11', // in example: check
        {
          start: new Date(Date.parse('2018-04-04T05:10:00.000Z')),
          end: new Date(Date.parse('2018-04-04T05:11:00.000Z')),
        },
      ],
      [
        'this notation implies an hour',
        'sprint 10 to 10', // in example: check
        {
          start: new Date(Date.parse('2018-04-04T05:10:00.000Z')),
          end: new Date(Date.parse('2018-04-04T06:10:00.000Z')),
        },
      ],
      [
        'sprint at 59 is fine',
        'sprint at 59', // in example: check
        {
          start: new Date(Date.parse('2018-04-04T04:59:00.000Z')),
          end: new Date(Date.parse('2018-04-04T05:29:00.000Z')),
        },
      ],
      [
        'sprint at 60 is nonsense! what does that mean?',
        'sprint at 60', // TODO make an 'invalid examples' auto section?
        undefined,
      ],
      [
        'sprint at 70 is weird! - you cannot create sprints that far in the future',
        'sprint at 71',
        undefined,
      ],
      [
        'sprint to 89 is also weird! answer is NO',
        'sprint at 10 to 89',
        undefined,
      ],
      [
        'sprint to 59 is fine',
        'sprint at 10 to 59', // in example: check
        {
          start: new Date(Date.parse('2018-04-04T05:10:00.000Z')),
          end: new Date(Date.parse('2018-04-04T05:59:00.000Z')),
        },
      ],
      [
        'sprint to 0 is also fine',
        'sprint at 10 to 0', // in example: check
        {
          start: new Date(Date.parse('2018-04-04T05:10:00.000Z')),
          end: new Date(Date.parse('2018-04-04T06:00:00.000Z')),
        },
      ],
      [
        'numbers like :00 do not confuse anything',
        'sprint at 10 to 00', // in example: check
        {
          start: new Date(Date.parse('2018-04-04T05:10:00.000Z')),
          end: new Date(Date.parse('2018-04-04T06:00:00.000Z')),
        },
      ],
    ]
  )
})
