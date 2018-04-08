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

  describe('find_me', function() {

    it( 'filtered', function(){
       // TODO this is temporary while I unbreak my shit
      const message = 'sprint 15 to 25'
      const expected = {
        start: new Date(Date.parse('2018-04-04T05:15:00.000Z')),
        end: new Date(Date.parse('2018-04-04T05:25:00.000Z')),
      }
      const sprint = createSprintFromMessage(message, 1522815707792)
      expect(sprint).to.be.equalSprintDefinition(expected)
    })

      it( 'filtered2', function(){
         // TODO this is temporary while I unbreak my shit
        const message = 'sprint 70 to 25'
        const sprint = createSprintFromMessage(message, 1522815707792)
        expect(sprint).to.be.undefined
      })
})
