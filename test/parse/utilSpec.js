import {unroll} from '../spec.js'
import {preparseMessage, parse} from '../../src/parse/util.js'
import {expect} from 'chai'

const itPreparsesMessage = (rawMessage, expectedMessage) => {
  const message = preparseMessage(rawMessage)
  expect(message).to.be.equal(expectedMessage)
}

describe('parse util', function(){
  unroll(
    'cleans up #message for parsing - #reason',
    function(done, args){
      itPreparsesMessage(args.message, args.expected)
      done()
    },
    [
      [ 'reason', 'message', 'expected' ],
      [ 'no op', 'foo bar', 'foo bar' ],
      [ 'lower case everything', 'HELP help heLP', 'help help help' ],
      [ 'trim excess whitespace', 'what       ', 'what' ],
      [ 'trim internal whitespace', 'long      space', 'long space' ],
      [
        'remove punctuation',
        'period. comma, quote" singlequote\' colon: etc!@$%^&*()',
        'period comma quote singlequote colon etc',
      ],
      [
        // this one is just a consequence of removing all punctuation...
        'negative numbers do not exist',
        'negative -1',
        'negative 1',
      ],
      [ 'number ranges change', '7-20', '7 20' ],
    ]
  )

  unroll(
    'parses #message to match #command with #args - reason',
    function(done, args){
      const parsedMessage = parse(args.message, args.command, args.args)
      expect(parsedMessage).to.be.deep.equal(args.expected)
      done()
    },
    [
      [ 'reason', 'message', 'command', 'args', 'expected' ],
      [
        'exact match literal',
        'foo bar cat',
        'foo',
        [ 'bar', 'cat' ],
        [ 'foo', 'bar', 'cat' ],
      ],
      [
        'match literal with extra',
        'a foo b bar c cat d',
        'foo',
        [ 'bar', 'cat' ],
        [ 'foo', 'bar', 'cat' ],
      ],
      [
        'match literal with extras duplicates out of order',
        'sprint 0 5 to 5',
        'sprint',
        [ '0', 'to', '5' ],
        [ 'sprint', '0', 'to', '5' ],
      ],
      [
        'match arg type',
        'sprint 0',
        'sprint',
        [ 'Number' ],
        [ 'sprint', '0' ],
      ],
      [
        'match arg type first match',
        'sprint 0 1 2 3 5',
        'sprint',
        [ 'Number' ],
        [ 'sprint', '0' ],
      ],
      [
        'match arg type first match each num',
        'sprint 0 1 2 3 to 5',
        'sprint',
        [ 'Number', 'to', 'Number' ],
        [ 'sprint', '0', 'to', '5' ],
      ],
    ] // TODO list some that fail to match...
  )
})
