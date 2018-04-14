var _ = require('lodash')
import {unroll} from '../spec.js'
import {expect} from 'chai'
import {
  isValidCommandName,
  validCommandsString,
  lookupCommand,
} from '../../src/utils/commandUtils.js'

describe('Command Utils', function(){
  describe('isValidCommandName', function(){
    unroll(
      '#isValid: #name is a valid command name',
      function(done, args){
        expect(isValidCommandName(args.name)).to.be.equals(args.isValid)
        done()
      },
      [
        [ 'name', 'isValid' ],
        [ 'sprint', true ],
        [ 'sprints', false ], // TODO although it should be valid, honestly
        [ 'admin', true ],
        [ 'nonsense', false ],
      ]
    )
  })

  describe('validCommandsString', function(){
    it('is a string of valid commands', function(){
      expect(validCommandsString).to.be.equals('admin, sprint')
    })
  })

  describe('lookupCommand', function(){
    unroll(
      '#name has an intro and commands',
      function(done, args){
        const command = lookupCommand(args.name)
        expect(_.has(command, 'intro')).to.be.true
        expect(_.has(command, 'commands')).to.be.true
        done()
      },
      [ [ 'name' ], [ 'sprint' ], [ 'admin' ] ]
    )
  })
})
