import {unroll} from '../spec.js'
import {preparseMessage} from '../../src/parse/util.js'
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
    ]
  )
})
