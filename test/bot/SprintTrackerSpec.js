// const SprintTracker = require('../../src/bot/SprintTracker.js').default // no idea why it likes this form
import {expect} from 'chai'
import {SprintTracker, RESPONSES} from '../../src/bot/SprintTracker.js'

describe('Sprint Tracker', function(){
  var sprintTracker
  const timestamp = 1522815707792
  const defaultSprint = {
    timeout: {start: 12208, end: 1812208},
    sprint: {start: 1522815720000, end: 1522817520000},
  }

  beforeEach(function(){
    sprintTracker = new SprintTracker()
  })

  describe('start sprint', function(){
    it('configures sprint if none already', function(){
      const result = sprintTracker.processCommand('sprint now', timestamp)
      expect(sprintTracker.cache).to.be.deep.equals(defaultSprint)
      expect(result).to.be.equals(RESPONSES.SPRING_IS_GO)
    })

    it('responds if sprint already configured', function(){
      sprintTracker.processCommand('sprint now', timestamp)
      const result = sprintTracker.processCommand(
        'sprint now',
        timestamp + 50000
      )
      expect(sprintTracker.cache).to.be.deep.equals(defaultSprint)
      expect(result).to.be.equals(RESPONSES.SPRINT_ALREADY_CONFIGURED)
    })
  })

  describe('cancel sprint', function(){
    it('responds if no sprint is configured', function(){
      const result = sprintTracker.processCommand('cancel sprint', timestamp)
      expect(sprintTracker.cache).to.be.deep.equals({})
      expect(result).to.be.equals(RESPONSES.NO_SPRINT)
    })

    it('cancels if sprint already configured (before sprint starts)', function(){
      sprintTracker.processCommand('sprint now', timestamp)
      expect(sprintTracker.cache).to.be.deep.equals(defaultSprint)
      const result = sprintTracker.processCommand(
        'cancel sprint',
        timestamp + 2208
      )
      // TODO??? expect(sprintTracker.cache).to.be.deep.equals({  })
      expect(result).to.be.equals(RESPONSES.CANCEL_CONFIRMED)
    })

    it('cancels if sprint already configured (after sprint starts)', function(){
      sprintTracker.processCommand('sprint now', timestamp)
      expect(sprintTracker.cache).to.be.deep.equals(defaultSprint)
      const result = sprintTracker.processCommand(
        'cancel sprint',
        timestamp + 22208
      )
      // TODO??? expect(sprintTracker.cache).to.be.deep.equals({  })
      expect(result).to.be.equals(RESPONSES.CANCEL_CONFIRMED)
    })
  })

  describe('sprint info', function(){
    it('responds if no sprint is configured', function(){
      const result = sprintTracker.processCommand('info', timestamp)
      expect(sprintTracker.cache).to.be.deep.equals({})
      expect(result).to.be.equals(RESPONSES.NO_SPRINT)
    })

    it('replies with message about pending sprint', function(){
      sprintTracker.processCommand('sprint now', timestamp)
      expect(sprintTracker.cache).to.be.deep.equals(defaultSprint)
      const result = sprintTracker.processCommand('info', timestamp + 2208)
      expect(result).to.be.equals("There's a sprint from 00:10 until 30:10.")
    })

    it('replies with message about pending sprint (clock wrapping behavior)', function(){
      sprintTracker.processCommand('sprint in 45', timestamp)
      const result = sprintTracker.processCommand('info', timestamp + 2208)
      expect(result).to.be.equals("There's a sprint from 44:10 until 14:10.")
    })

    it('replies with message about running sprint just after it started', function(){
      sprintTracker.processCommand('sprint now', timestamp)
      expect(sprintTracker.cache).to.be.deep.equals(defaultSprint)
      const result = sprintTracker.processCommand('info', timestamp + 22208)
      expect(result).to.be.equals(
        'Currently running a sprint. 29:50 remaining.'
      )
    })

    it('replies with message about running sprint just before it ends', function(){
      sprintTracker.processCommand('sprint now', timestamp)
      expect(sprintTracker.cache).to.be.deep.equals(defaultSprint)
      const result = sprintTracker.processCommand('info', timestamp + 1811208)
      expect(result).to.be.equals(
        'Currently running a sprint. 00:01 remaining.'
      )
    })
  })
})
