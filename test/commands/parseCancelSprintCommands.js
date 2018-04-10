var _ = require('lodash')
import {unroll} from '../spec.js'
import {cancelSprintCommands} from '../../src/commands/cancelSprintCommand.js'
import {createObjFromMessage} from '../../src/utils/parseUtils.js'
import {expect} from 'chai'

const unrollCommandExamples = _.map(
  _.flatMap(cancelSprintCommands, command => {
    return _.map(command.examples, example => {
      return {ex: example, config: command}
    })
  }),
  unroll => {
    return [ unroll.config, unroll.ex ]
  }
)

describe('Parse Cancel Sprint Command', function(){
  describe('self describing generated tests', function(){
    unroll(
      'creates cancel sprint from #example.input',
      function(done, args){
        const result = createObjFromMessage(
          cancelSprintCommands,
          args.example.input,
          1523059200000
        )

        expect(result).to.be.true
        done()
      },
      _.concat([ [ 'command', 'example' ] ], unrollCommandExamples)
    )
  })
})
