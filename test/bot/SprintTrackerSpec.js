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
      expect(sprintTracker.cache).to.be.deep.equals(defaultSprint)
      expect(result).to.be.equals(RESPONSES.CANCEL_CONFIRMED)
      sprintTracker.clearSprint()
      expect(sprintTracker.cache).to.be.deep.equals({})
    })

    it('cancels if sprint already configured (after sprint starts)', function(){
      sprintTracker.processCommand('sprint now', timestamp)
      expect(sprintTracker.cache).to.be.deep.equals(defaultSprint)
      const result = sprintTracker.processCommand(
        'cancel sprint',
        timestamp + 22208
      )
      expect(sprintTracker.cache).to.be.deep.equals(defaultSprint)
      expect(result).to.be.equals(RESPONSES.CANCEL_CONFIRMED)
      sprintTracker.clearSprint()
      expect(sprintTracker.cache).to.be.deep.equals({})
    })
  })

  describe('sprint info', function(){
    it('responds if no sprint is configured', function(){
      const result = sprintTracker.processCommand('sprint info', timestamp)
      expect(sprintTracker.cache).to.be.deep.equals({})
      expect(result).to.be.equals(RESPONSES.NO_SPRINT)
    })

    it('replies with message about pending sprint', function(){
      sprintTracker.processCommand('sprint now', timestamp)
      expect(sprintTracker.cache).to.be.deep.equals(defaultSprint)
      const result = sprintTracker.processCommand(
        'sprint info',
        timestamp + 2208
      )
      expect(result).to.be.equals(
        "There's a sprint from :22 until :52 (starts in 0 min 10 sec)."
      )
    })

    it('replies with message about pending sprint (clock wrapping behavior)', function(){
      sprintTracker.processCommand('sprint in 45', timestamp)
      const result = sprintTracker.processCommand(
        'sprint info',
        timestamp + 2208
      )
      expect(result).to.be.equals(
        "There's a sprint from :06 until :36 (starts in 44 min 10 sec)."
      )
    })

    it('replies with message about running sprint just after it started', function(){
      sprintTracker.processCommand('sprint now', timestamp)
      expect(sprintTracker.cache).to.be.deep.equals(defaultSprint)
      const result = sprintTracker.processCommand(
        'sprint info',
        timestamp + 22208
      )
      expect(result).to.be.equals(
        'Currently running a sprint. 29 min 50 sec remaining.'
      )
    })

    it('replies with message about running sprint just before it ends', function(){
      sprintTracker.processCommand('sprint now', timestamp)
      expect(sprintTracker.cache).to.be.deep.equals(defaultSprint)
      const result = sprintTracker.processCommand(
        'sprint info',
        timestamp + 1811208
      )
      expect(result).to.be.equals(
        'Currently running a sprint. 0 min 1 sec remaining.'
      )
    })
  })
})
