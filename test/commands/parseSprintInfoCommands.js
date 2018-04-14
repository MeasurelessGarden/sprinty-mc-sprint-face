var _ = require('lodash')
import {unroll} from '../spec.js'
import {sprintInfoCommands} from '../../src/commands/sprintInfoCommand.js'
import {createObjFromMessage} from '../../src/utils/parseUtils.js'
import {expect} from 'chai'

const unrollCommandExamples = _.map(
  _.flatMap(sprintInfoCommands, command => {
    return _.map(command.examples, example => {
      return {ex: example, config: command}
    })
  }),
  unroll => {
    return [ unroll.config, unroll.ex ]
  }
)

describe('Parse Sprint Info Command', function(){
  describe('self describing generated tests', function(){
    unroll(
      'creates sprint info from #example.input',
      function(done, args){
        const result = createObjFromMessage(
          sprintInfoCommands,
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
