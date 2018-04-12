var _ = require('lodash')
import {unroll} from '../spec.js'
import {sprintCommands} from '../../src/commands/sprintCommand.js'
import {cancelSprintCommands} from '../../src/commands/cancelSprintCommand.js'
import {createObjFromMessage} from '../../src/utils/parseUtils.js'
import {assert, expect} from 'chai'

describe('conflicting and ambiguous commands', function(){
  unroll(
    '#input matches sprint (#sprint) and cancel (#cancel) commands',
    function(done, args){
      const sprint = createObjFromMessage(
        sprintCommands,
        args.input,
        1522815707792
      )
      const cancel = createObjFromMessage(
        cancelSprintCommands,
        args.input,
        1522815707792
      )

      if (args.sprint) {
        expect(typeof sprint).to.be.equals('object')
      }
      else {
        expect(sprint).to.be.undefined
      }
      if (args.cancel) {
        expect(cancel).to.be.true
      }
      else {
        expect(cancel).to.be.undefined
      }

      done()
    },
    [
      [ 'input', 'sprint', 'cancel' ],
      [ 'cancel sprint now', true, true ],
      [ 'cancel sprint', false, true ],
      [ 'sprint now', true, false ],
    ]
  )
})
