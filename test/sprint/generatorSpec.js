import {unroll} from '../spec.js'
import {generateSprintWithDuration} from '../../src/sprint/generator.js'
import {expect} from 'chai'

const itGeneratesSprintWithDuration = (now, startMin, duration, expected) => {
  const sprint = generateSprintWithDuration(now, startMin, duration)
  // expect (sprint.start).to.be.equalDateTime(expected.start)
  expect(sprint).to.be.equalSprintDefinition(expected)
}

describe('Sprint generator', function(){
  // it('parsing dates...', function(){
  //   console.log("foobar", new Date(Date.parse("April 12, 2019 2:00 pm")))
  // })
  it('can run a function', function(){
    const sprint = generateSprintWithDuration(new Date(), 15, 20)
  })
  unroll(
    'generates a sprint from #now starting at #startMin with duration #duration',
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
      [ 'now', 'startMin', 'duration', 'expected' ],
      [
        new Date(Date.parse('April 5, 2018 2:00 pm')),
        15,
        30,
        {
          start: new Date(Date.parse('April 5, 2018 2:15 pm')),
          end: new Date(Date.parse('April 5, 2018 2:45 pm')),
        },
      ],
    ]
  )
})
