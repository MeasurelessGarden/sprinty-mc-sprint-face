import {unroll} from '../spec.js'
import {sprintCommands} from '../../src/commands/sprintCommand.js'
import {createObjFromMessage} from '../../src/commands/parseUtils.js'
import {expect} from 'chai'

describe('Parse Sprint Command', function(){
  unroll(
    'generates a sprint from #message',
    function(done, args){
      const sprint = createObjFromMessage(
        sprintCommands,
        args.message,
        1522815707792
      )
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
        'sprint at 10 for 60',
        {
          start: new Date(Date.parse('2018-04-04T05:10:00.000Z')),
          end: new Date(Date.parse('2018-04-04T06:10:00.000Z')),
        },
      ],
      [
        'sprints cannot be longer than an hour',
        'sprint at 10 for 61',
        undefined,
      ],
      [
        'sprints of no length make zero sense',
        'sprint at 10 for 0',
        undefined,
      ],
      [
        'sprints of 1 minute are ok',
        'sprint at 10 for 1',
        {
          start: new Date(Date.parse('2018-04-04T05:10:00.000Z')),
          end: new Date(Date.parse('2018-04-04T05:11:00.000Z')),
        },
      ],
      [
        'sprints of 1 minute can be defined multiple ways',
        'sprint at 10 to 11',
        {
          start: new Date(Date.parse('2018-04-04T05:10:00.000Z')),
          end: new Date(Date.parse('2018-04-04T05:11:00.000Z')),
        },
      ],
      [
        'this notation implies an hour',
        'sprint 10 to 10',
        {
          start: new Date(Date.parse('2018-04-04T05:10:00.000Z')),
          end: new Date(Date.parse('2018-04-04T06:10:00.000Z')),
        },
      ],
      [
        'sprint at 59 is fine',
        'sprint at 59',
        {
          start: new Date(Date.parse('2018-04-04T04:59:00.000Z')),
          end: new Date(Date.parse('2018-04-04T05:29:00.000Z')),
        },
      ],
      [
        'sprint at 60 is nonsense! what does that mean?',
        'sprint at 60',
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
        'sprint at 10 to 59',
        {
          start: new Date(Date.parse('2018-04-04T05:10:00.000Z')),
          end: new Date(Date.parse('2018-04-04T05:59:00.000Z')),
        },
      ],
      [
        'sprint to 0 is also fine',
        'sprint at 10 to 0',
        {
          start: new Date(Date.parse('2018-04-04T05:10:00.000Z')),
          end: new Date(Date.parse('2018-04-04T06:00:00.000Z')),
        },
      ],
      [
        'numbers like :00 do not confuse anything',
        'sprint at 10 to 00',
        {
          start: new Date(Date.parse('2018-04-04T05:10:00.000Z')),
          end: new Date(Date.parse('2018-04-04T06:00:00.000Z')),
        },
      ],
    ]
  )
})