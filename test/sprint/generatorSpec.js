import {unroll} from '../spec.js'
import {
  generateSprintWithDuration,
  generateSprintWithEndTime,
  createSprintFromMessage,
} from '../../src/sprint/generator.js'
import {expect} from 'chai'

const itGeneratesSprintWithDuration = (now, startMin, duration, expected) => {
  const sprint = generateSprintWithDuration(now, startMin, duration)
  // expect (sprint.start).to.be.equalDateTime(expected.start)
  expect(sprint).to.be.equalSprintDefinition(expected)
}
const itGenerateSprintWithEndTime = (now, startMin, endMin, expected) => {
  const sprint = generateSprintWithEndTime(now, startMin, endMin)
  expect(sprint).to.be.equalSprintDefinition(expected)
}

describe('Sprint generator', function(){
  // it('can run a function', function(){
  //   const sprint = generateSprintWithDuration(new Date(), 15, 20)
  // })

  unroll(
    'generates a sprint from #now starting at #startMin with duration #duration - #reason',
    function(done, args){
      itGeneratesSprintWithDuration(
        args.now,
        args.startMin,
        args.duration,
        args.expected
      )
      done()
    },
    [
      [ 'reason', 'now', 'startMin', 'duration', 'expected' ],
      [
        'simple',
        new Date(Date.parse('April 5, 2018 2:00 pm')),
        15,
        30,
        {
          start: new Date(Date.parse('April 5, 2018 2:15 pm')),
          end: new Date(Date.parse('April 5, 2018 2:45 pm')),
        },
      ],
      [
        'end wraps to next hour',
        new Date(Date.parse('April 5, 2018 2:00 pm')),
        45,
        30,
        {
          start: new Date(Date.parse('April 5, 2018 2:45 pm')),
          end: new Date(Date.parse('April 5, 2018 3:15 pm')),
        },
      ],
      [
        'start and end wrap to next hour',
        new Date(Date.parse('April 5, 2018 2:15 pm')),
        0,
        30,
        {
          start: new Date(Date.parse('April 5, 2018 3:00 pm')),
          end: new Date(Date.parse('April 5, 2018 3:30 pm')),
        },
      ],
      [
        'start wraps to next hour, end wraps to hour after *that*',
        new Date(Date.parse('April 5, 2018 2:45 pm')),
        40,
        30,
        {
          start: new Date(Date.parse('April 5, 2018 3:40 pm')),
          end: new Date(Date.parse('April 5, 2018 4:10 pm')),
        },
      ],
      [
        'end wraps to exactly next hour',
        new Date(Date.parse('April 5, 2018 2:15 pm')),
        30,
        30,
        {
          start: new Date(Date.parse('April 5, 2018 2:30 pm')),
          end: new Date(Date.parse('April 5, 2018 3:00 pm')),
        },
      ],
      [
        'end wraps to next hour offset from quarter-hours',
        new Date(Date.parse('April 5, 2018 2:45 pm')),
        50,
        30,
        {
          start: new Date(Date.parse('April 5, 2018 2:50 pm')),
          end: new Date(Date.parse('April 5, 2018 3:20 pm')),
        },
      ],
      [
        'end wraps to next day',
        new Date(Date.parse('2018-04-05T23:30:00.000Z')),
        45,
        30,
        {
          start: new Date(Date.parse('2018-04-05T23:45:00.000Z')),
          end: new Date(Date.parse('2018-04-06T00:15:00.000Z')),
        },
      ],
      [
        'start and end wrap to next day',
        new Date(Date.parse('2018-04-05T23:45:00.000Z')),
        15,
        30,
        {
          start: new Date(Date.parse('2018-04-06T00:15:00.000Z')),
          end: new Date(Date.parse('2018-04-06T00:45:00.000Z')),
        },
      ],
      [
        'different duration',
        new Date(Date.parse('2018-04-05T05:10:00.000Z')),
        15,
        37,
        {
          start: new Date(Date.parse('2018-04-05T05:15:00.000Z')),
          end: new Date(Date.parse('2018-04-05T05:52:00.000Z')),
        },
      ],
    ]
  )

  unroll(
    'generates a sprint from #now starting at #startMin until #endMin - #reason',
    function(done, args){
      itGenerateSprintWithEndTime(
        args.now,
        args.startMin,
        args.endMin,
        args.expected
      )
      done()
    },
    [
      [ 'reason', 'now', 'startMin', 'endMin', 'expected' ],
      [
        'simple',
        new Date(Date.parse('April 5, 2018 2:00 pm')),
        15,
        45,
        {
          start: new Date(Date.parse('April 5, 2018 2:15 pm')),
          end: new Date(Date.parse('April 5, 2018 2:45 pm')),
        },
      ],
      [
        'end wraps to next hour',
        new Date(Date.parse('April 5, 2018 2:00 pm')),
        45,
        15,
        {
          start: new Date(Date.parse('April 5, 2018 2:45 pm')),
          end: new Date(Date.parse('April 5, 2018 3:15 pm')),
        },
      ],
      [
        'start and end wrap to next hour',
        new Date(Date.parse('April 5, 2018 2:15 pm')),
        0,
        30,
        {
          start: new Date(Date.parse('April 5, 2018 3:00 pm')),
          end: new Date(Date.parse('April 5, 2018 3:30 pm')),
        },
      ],
      [
        'start wraps to next hour, end wraps to hour after *that*',
        new Date(Date.parse('April 5, 2018 2:45 pm')),
        40,
        10,
        {
          start: new Date(Date.parse('April 5, 2018 3:40 pm')),
          end: new Date(Date.parse('April 5, 2018 4:10 pm')),
        },
      ],
      [
        'end wraps to exactly next hour',
        new Date(Date.parse('April 5, 2018 2:15 pm')),
        30,
        0,
        {
          start: new Date(Date.parse('April 5, 2018 2:30 pm')),
          end: new Date(Date.parse('April 5, 2018 3:00 pm')),
        },
      ],
      [
        'end wraps to next hour offset from quarter-hours',
        new Date(Date.parse('April 5, 2018 2:45 pm')),
        50,
        20,
        {
          start: new Date(Date.parse('April 5, 2018 2:50 pm')),
          end: new Date(Date.parse('April 5, 2018 3:20 pm')),
        },
      ],
      [
        'end wraps to next day',
        new Date(Date.parse('2018-04-05T23:30:00.000Z')),
        45,
        15,
        {
          start: new Date(Date.parse('2018-04-05T23:45:00.000Z')),
          end: new Date(Date.parse('2018-04-06T00:15:00.000Z')),
        },
      ],
      [
        'start and end wrap to next day',
        new Date(Date.parse('2018-04-05T23:45:00.000Z')),
        15,
        45,
        {
          start: new Date(Date.parse('2018-04-06T00:15:00.000Z')),
          end: new Date(Date.parse('2018-04-06T00:45:00.000Z')),
        },
      ],
      [
        'different duration',
        new Date(Date.parse('2018-04-05T05:10:00.000Z')),
        15,
        37,
        {
          start: new Date(Date.parse('2018-04-05T05:15:00.000Z')),
          end: new Date(Date.parse('2018-04-05T05:37:00.000Z')),
        },
      ],
    ]
  )

  unroll(
    'generates a sprint from #message',
    function(done, args){
      const sprint = createSprintFromMessage(args.message, 1522815707792)
      expect(sprint).to.be.equalSprintDefinition(args.expected)
      done()
    },
    [
      [ 'message', 'expected' ],
      [
        'ANYONE WANT TO SPRINT AT 25?',
        {
          start: new Date(Date.parse('2018-04-04T04:25:00.000Z')),
          end: new Date(Date.parse('2018-04-04T04:55:00.000Z')),
        },
      ],
      [
        'I want to sprint at :45',
        {
          start: new Date(Date.parse('2018-04-04T04:45:00.000Z')),
          end: new Date(Date.parse('2018-04-04T05:15:00.000Z')),
        },
      ],
      [
        "let's sprint 40 to 45",
        {
          start: new Date(Date.parse('2018-04-04T04:40:00.000Z')),
          end: new Date(Date.parse('2018-04-04T04:45:00.000Z')),
        },
      ],
      [
        'sprint 15',
        {
          start: new Date(Date.parse('2018-04-04T05:15:00.000Z')),
          end: new Date(Date.parse('2018-04-04T05:45:00.000Z')),
        },
      ],
      [
        'sprint 15 to 25',
        {
          start: new Date(Date.parse('2018-04-04T05:15:00.000Z')),
          end: new Date(Date.parse('2018-04-04T05:25:00.000Z')),
        },
      ],
      [
        'sprint 15 to :35',
        {
          start: new Date(Date.parse('2018-04-04T05:15:00.000Z')),
          end: new Date(Date.parse('2018-04-04T05:35:00.000Z')),
        },
      ],
      [
        'sprint 57 for 32',
        {
          start: new Date(Date.parse('2018-04-04T04:57:00.000Z')),
          end: new Date(Date.parse('2018-04-04T05:29:00.000Z')),
        },
      ],
      [
        'sprint :15',
        {
          start: new Date(Date.parse('2018-04-04T05:15:00.000Z')),
          end: new Date(Date.parse('2018-04-04T05:45:00.000Z')),
        },
      ],
      [
        'sprint at 20',
        {
          start: new Date(Date.parse('2018-04-04T05:20:00.000Z')),
          end: new Date(Date.parse('2018-04-04T05:50:00.000Z')),
        },
      ],
      [
        'sprint at 20 for 6 min',
        {
          start: new Date(Date.parse('2018-04-04T05:20:00.000Z')),
          end: new Date(Date.parse('2018-04-04T05:26:00.000Z')),
        },
      ],
      [
        'sprint at 25',
        {
          start: new Date(Date.parse('2018-04-04T04:25:00.000Z')),
          end: new Date(Date.parse('2018-04-04T04:55:00.000Z')),
        },
      ],
      [
        'sprint at 30',
        {
          start: new Date(Date.parse('2018-04-04T04:30:00.000Z')),
          end: new Date(Date.parse('2018-04-04T05:00:00.000Z')),
        },
      ],
      [
        'sprint at 30 for 14',
        {
          start: new Date(Date.parse('2018-04-04T04:30:00.000Z')),
          end: new Date(Date.parse('2018-04-04T04:44:00.000Z')),
        },
      ],
      [
        'sprint at 35 for 14',
        {
          start: new Date(Date.parse('2018-04-04T04:35:00.000Z')),
          end: new Date(Date.parse('2018-04-04T04:49:00.000Z')),
        },
      ],
      [
        'sprint at 35 to 20',
        {
          start: new Date(Date.parse('2018-04-04T04:35:00.000Z')),
          end: new Date(Date.parse('2018-04-04T05:20:00.000Z')),
        },
      ],
      [
        'sprint at 55 for 55',
        {
          start: new Date(Date.parse('2018-04-04T04:55:00.000Z')),
          end: new Date(Date.parse('2018-04-04T05:50:00.000Z')),
        },
      ],
      [
        'shall we sprint :20 for about 55 min?',
        {
          start: new Date(Date.parse('2018-04-04T05:20:00.000Z')),
          end: new Date(Date.parse('2018-04-04T06:15:00.000Z')),
        },
      ],
      [
        'sprint 30 for 34 minutes',
        {
          start: new Date(Date.parse('2018-04-04T04:30:00.000Z')),
          end: new Date(Date.parse('2018-04-04T05:04:00.000Z')),
        },
      ],
      [
        'sprint at 30 for 34 minutes',
        {
          start: new Date(Date.parse('2018-04-04T04:30:00.000Z')),
          end: new Date(Date.parse('2018-04-04T05:04:00.000Z')),
        },
      ],
      // [
      //   'should we go at 10?',
      //   {
      //     start: new Date(Date.parse('2018-04-04T05:10:00.000Z')),
      //     end: new Date(Date.parse('2018-04-04T05:40:00.000Z')),
      //   },
      // ],
    ]
  )
})
