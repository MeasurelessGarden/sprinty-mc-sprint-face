import {unroll} from '../spec.js'
import {expect} from 'chai'
import {
  generateSprintWithEndTime,
  generateSprintWithDuration,
} from '../../src/generator/sprintGenerator.js'

describe('Sprint Generator', function(){
  describe('generateSprintWithDuration', function(){
    unroll(
      `generates a sprint from #now starting at #startMin with duration #duration - #reason`,
      function(done, args){
        const sprint = generateSprintWithDuration(
          args.startMin,
          args.duration,
          Date.parse(args.now)
        )
        expect(sprint).to.be.equalSprintDefinition(args.expected)
        done()
      },
      [
        [ 'reason', 'now', 'startMin', 'duration', 'expected' ],
        [
          'simple',
          'April 5, 2018 2:00 pm',
          15,
          30,
          {
            start: Date.parse('April 5, 2018 2:15 pm'),
            end: Date.parse('April 5, 2018 2:45 pm'),
          },
        ],
        [
          'end wraps to next hour',
          'April 5, 2018 2:00 pm',
          45,
          30,
          {
            start: Date.parse('April 5, 2018 2:45 pm'),
            end: Date.parse('April 5, 2018 3:15 pm'),
          },
        ],
        [
          'start and end wrap to next hour',
          'April 5, 2018 2:15 pm',
          0,
          30,
          {
            start: Date.parse('April 5, 2018 3:00 pm'),
            end: Date.parse('April 5, 2018 3:30 pm'),
          },
        ],
        [
          'start wraps to next hour, end wraps to hour after *that*',
          'April 5, 2018 2:45 pm',
          40,
          30,
          {
            start: Date.parse('April 5, 2018 3:40 pm'),
            end: Date.parse('April 5, 2018 4:10 pm'),
          },
        ],
        [
          'end wraps to exactly next hour',
          'April 5, 2018 2:15 pm',
          30,
          30,
          {
            start: Date.parse('April 5, 2018 2:30 pm'),
            end: Date.parse('April 5, 2018 3:00 pm'),
          },
        ],
        [
          'end wraps to next hour offset from quarter-hours',
          'April 5, 2018 2:45 pm',
          50,
          30,
          {
            start: Date.parse('April 5, 2018 2:50 pm'),
            end: Date.parse('April 5, 2018 3:20 pm'),
          },
        ],
        [
          'end wraps to next day',
          '2018-04-05T23:30:00.000Z',
          45,
          30,
          {
            start: Date.parse('2018-04-05T23:45:00.000Z'),
            end: Date.parse('2018-04-06T00:15:00.000Z'),
          },
        ],
        [
          'start and end wrap to next day',
          '2018-04-05T23:45:00.000Z',
          15,
          30,
          {
            start: Date.parse('2018-04-06T00:15:00.000Z'),
            end: Date.parse('2018-04-06T00:45:00.000Z'),
          },
        ],
        [
          'different duration',
          '2018-04-05T05:10:00.000Z',
          15,
          37,
          {
            start: Date.parse('2018-04-05T05:15:00.000Z'),
            end: Date.parse('2018-04-05T05:52:00.000Z'),
          },
        ],
      ]
    )
  })

  describe('generateSprintWithEndTime', function(){
    unroll(
      'generates a sprint from #now starting at #startMin until #endMin - #reason',
      function(done, args){
        const sprint = generateSprintWithEndTime(
          args.startMin,
          args.endMin,
          Date.parse(args.now)
        )
        expect(sprint).to.be.equalSprintDefinition(args.expected)
        done()
      },
      [
        [ 'reason', 'now', 'startMin', 'endMin', 'expected' ],
        [
          'simple',
          'April 5, 2018 2:00 pm',
          15,
          45,
          {
            start: Date.parse('April 5, 2018 2:15 pm'),
            end: Date.parse('April 5, 2018 2:45 pm'),
          },
        ],
        [
          'end wraps to next hour',
          'April 5, 2018 2:00 pm',
          45,
          15,
          {
            start: Date.parse('April 5, 2018 2:45 pm'),
            end: Date.parse('April 5, 2018 3:15 pm'),
          },
        ],
        [
          'start and end wrap to next hour',
          'April 5, 2018 2:15 pm',
          0,
          30,
          {
            start: Date.parse('April 5, 2018 3:00 pm'),
            end: Date.parse('April 5, 2018 3:30 pm'),
          },
        ],
        [
          'start wraps to next hour, end wraps to hour after *that*',
          'April 5, 2018 2:45 pm',
          40,
          10,
          {
            start: Date.parse('April 5, 2018 3:40 pm'),
            end: Date.parse('April 5, 2018 4:10 pm'),
          },
        ],
        [
          'end wraps to exactly next hour',
          'April 5, 2018 2:15 pm',
          30,
          0,
          {
            start: Date.parse('April 5, 2018 2:30 pm'),
            end: Date.parse('April 5, 2018 3:00 pm'),
          },
        ],
        [
          'end wraps to next hour offset from quarter-hours',
          'April 5, 2018 2:45 pm',
          50,
          20,
          {
            start: Date.parse('April 5, 2018 2:50 pm'),
            end: Date.parse('April 5, 2018 3:20 pm'),
          },
        ],
        [
          'end wraps to next day',
          '2018-04-05T23:30:00.000Z',
          45,
          15,
          {
            start: Date.parse('2018-04-05T23:45:00.000Z'),
            end: Date.parse('2018-04-06T00:15:00.000Z'),
          },
        ],
        [
          'start and end wrap to next day',
          '2018-04-05T23:45:00.000Z',
          15,
          45,
          {
            start: Date.parse('2018-04-06T00:15:00.000Z'),
            end: Date.parse('2018-04-06T00:45:00.000Z'),
          },
        ],
        [
          'different duration',
          '2018-04-05T05:10:00.000Z',
          15,
          37,
          {
            start: Date.parse('2018-04-05T05:15:00.000Z'),
            end: Date.parse('2018-04-05T05:37:00.000Z'),
          },
        ],
      ]
    )
  })
})
