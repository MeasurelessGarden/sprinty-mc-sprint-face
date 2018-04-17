var _ = require('lodash')
import {unroll} from '../spec.js'
import {expect} from 'chai'
import {
  isValidCommandName,
  validCommandsString,
  generate,
} from '../../src/utils/commandUtils.js'

import {generateHelp, generateExamples} from '../../src/utils/helpUtils.js'
import {TESTS} from '../../src/commands/helpCommand.js'

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
      expect(validCommandsString).to.be.equals('admin, count, sprint')
    })
  })

  describe('generate', function(){
    unroll(
      '#name is able to generate #help help and #examples example messages',
      function(done, args){
        const help = generate(args.name, generateHelp)
        const examples = generate(args.name, generateExamples)
        expect(help.length).to.be.equals(args.help)
        expect(examples.length).to.be.equals(args.examples)
        done()
      },
      [
        [ 'name', 'help', 'examples' ],
        [ 'sprint', TESTS.SPRINT, TESTS.SPRINT - 1 ],
        [ 'admin', TESTS.ADMIN, TESTS.ADMIN - 1 ],
      ]
    )
  })
})
