// const SprintTracker = require('../../src/bot/SprintTracker.js').default // no idea why it likes this form
import {expect} from 'chai'
import {SprintTracker, RESPONSES} from '../../src/bot/SprintTracker.js'

describe('Sprint Tracker', function(){
  describe('start sprint', function(){
    var sprintTracker
    const timestamp = 1522815707792
    // 1522815720000
    // 1522817520000
    beforeEach(function() {
      sprintTracker = new SprintTracker()
    })

    it('configures sprint if none already', function (){
      const result = sprintTracker.processCommand('sprint now', timestamp)
      console.log('cache', sprintTracker.cache)
      expect(sprintTracker.cache).to.be.deep.equals({

  timeout: { start: 12208, end: 1812208 },
  sprint: { start: 1522815720000, end: 1522817520000 }
      })
      expect(result).to.be.equals(RESPONSES.SPRING_IS_GO)
    })

    it('responds if sprint already configured', function (){

    })
  })
})
