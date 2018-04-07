import {unroll} from '../spec.js'
import {
  preparseMessage,
  parse,
  convertFunctionArgs,
  parseMessageToArgs
} from '../../src/parse/util.js'
import {expect} from 'chai'

describe('parse util', function(){
  unroll(
    'cleans up #message for parsing - #reason',
    function(done, args){
      const message = preparseMessage(args.message)
      expect(message).to.be.equal(args.expected)
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
    'parses #message to match #command - reason',
    function(done, args){
      const parsedMessage = parse(args.message, args.command)
      expect(parsedMessage).to.be.deep.equal(args.expected)
      done()
    },
    [
      [ 'reason', 'message', 'command', 'expected' ],
      [
        'exact match literal',
        'foo bar cat',
        [ 'foo', 'bar', 'cat' ],
        [ 'foo', 'bar', 'cat' ],
      ],
      [
        'match literal with extra',
        'a foo b bar c cat d',
        [ 'foo', 'bar', 'cat' ],
        [ 'foo', 'bar', 'cat' ],
      ],
      [
        'match literal with extras duplicates out of order',
        'sprint 0 5 to 5',
        [ 'sprint', '0', 'to', '5' ],
        [ 'sprint', '0', 'to', '5' ],
      ],
      [
        'match arg type',
        'sprint 0',
        [ 'sprint', 'Number' ],
        [ 'sprint', '0' ],
      ],
      [
        'match arg type first match',
        'sprint 0 1 2 3 5',
        [ 'sprint', 'Number' ],
        [ 'sprint', '0' ],
      ],
      [
        'match arg type first match each num',
        'sprint 0 1 2 3 to 5',
        [ 'sprint', 'Number', 'to', 'Number' ],
        [ 'sprint', '0', 'to', '5' ],
      ],
    ] // TODO list some that fail to match...
  )

  unroll(
    'converts function params from strings - #reason',
    function(done, args){
      const parsedFunctionArgs = convertFunctionArgs(
        args.parsedMessage,
        args.command
      )
      expect(parsedFunctionArgs).to.be.deep.equal(args.expected)
      done()
    },
    [
      [ 'reason', 'parsedMessage', 'command', 'expected' ],
      [
        'convert literal no op',
        [ 'sprint', '0', 'to', '5' ],
        [ 'sprint', '0', 'to', '5' ],
        [ 'sprint', '0', 'to', '5' ],
      ],
      [
        'convert numbers in matching parsed message',
        [ 'sprint', '0', 'to', '5' ],
        [ 'sprint', 'Number', 'to', 'Number' ],
        [ 'sprint', 0, 'to', 5 ],
      ],
    ]
  )

  unroll(
    'parseMessageToArgs converts #message with #command - #reason',
    function(done, args){
      const parsedFunctionArgs = parseMessageToArgs(
        args.message,
        args.command
      )
      expect(parsedFunctionArgs).to.be.deep.equal(args.expected)
      done()
    },
    // sprint at 30
    // sprint at 35 for 14
    // ANYONE WANT TO SPRINT AT 25?
    // let's sprint 40 to 45
    // sprint at 27 for 10 min
    // sprint :15
    // x1 command: [ 'sprint', 'at', 'Number' ]
    // TODO x2 command: [ 'sprint', 'Number', 'for', 'Number', 'min' ]
    // TODO x3 command: [ 'sprint', 'Number', 'to', 'Number' ]
    [
      [ 'reason', 'message', 'command', 'expected' ],
      [
        'simple sprint command matched perfectly',
        'sprint at 30',
        [ 'sprint', 'at', 'Number' ],
        [ 'sprint', 'at', 30 ],
      ],
      [
        'simple sprint command matched... but not really (example 1)',
        'sprint at 35 for 14',
        [ 'sprint', 'at', 'Number' ],
        [ 'sprint', 'at', 35 ], // TODO is this a 'command match fail' or a need to find the *best* command match?
      ],
      [
        'simple sprint command matched perfectly with human phrasing',
        'ANYONE WANT TO SPRINT AT 25?',
        [ 'sprint', 'at', 'Number' ],
        [ 'sprint', 'at', 25 ],
      ],
      [
        'simple sprint command without match - missing word to match (example 1)',
        'let\'s sprint 40 to 45',
        [ 'sprint', 'at', 'Number' ],
        undefined,
      ],
      [
        'simple sprint command matched... but not really (example 2)',
        'sprint at 27 for 10 min',
        [ 'sprint', 'at', 'Number' ],
        [ 'sprint', 'at', 27 ],
      ],
      [
        'simple sprint command without match - missing word to match (example 2)',
        'sprint :15',
        [ 'sprint', 'at', 'Number' ],
        undefined,
      ],

      // TODO x2

      [
        'sprint with default override does not match command implying default',
        'sprint at 30',
        [ 'sprint', 'Number', 'for', 'Number', 'min' ],
        undefined,
      ],
      [
        'sprint with default override requires all words',
        'sprint at 35 for 14',
        [ 'sprint', 'Number', 'for', 'Number', 'min' ],
        undefined
      ],
      [
        'sprint with default override (different command) matched perfectly',
        'sprint at 35 for 14',
        [ 'sprint', 'Number', 'for', 'Number'],
        ['sprint', 35, 'for', 14]
      ],
      [
        'sprint with default override ignores non-match',
        'ANYONE WANT TO SPRINT AT 25?',
        [ 'sprint', 'Number', 'for', 'Number', 'min' ],
        undefined,
      ],
      [
        'sprint with default override ignores unrelated command',
        'let\'s sprint 40 to 45',
        [ 'sprint', 'Number', 'for', 'Number', 'min' ],
        undefined,
      ],
      [
        'sprint with default override matched perfect',
        'sprint at 27 for 10 min',
        [ 'sprint', 'Number', 'for', 'Number', 'min' ],
        [ 'sprint', 27, 'for', 10, 'min' ],
      ],
      [
        'sprint with default override (different command) matched with extras',
        'sprint at 27 for 10 min',
        [ 'sprint', 'Number', 'for', 'Number'],
        ['sprint', 27, 'for', 10]
      ],
      [
        'sprint with default override ignores unrelated too many words missing command',
        'sprint :15',
        [ 'sprint', 'Number', 'for', 'Number', 'min' ],
        undefined,
      ],
      // TODO x3


      [
        'sprint from-to command ignores simple command',
        'sprint at 30',
        [ 'sprint', 'Number', 'to', 'Number' ],
        undefined,
      ],
      [
        'sprint from-to command ignores different command',
        'sprint at 35 for 14',
        [ 'sprint', 'Number', 'to', 'Number' ],
        undefined
      ],
      [
        'sprint from-to command ignores simple sprint command',
        'ANYONE WANT TO SPRINT AT 25?',
        [ 'sprint', 'Number', 'to', 'Number' ],
        undefined
      ],
      [
        'sprint from-to command matches human phrasing (example 1)',
        'let\'s sprint 40 to 45',
        [ 'sprint', 'Number', 'to', 'Number' ],
        ['sprint', 40, 'to', 45]
      ],
      [
        'sprint from-to command matches human phrasing (example 2)',
        'sprint from 13 to 29??',
        [ 'sprint', 'Number', 'to', 'Number' ],
        ['sprint', 13, 'to', 29]
      ],
      [
        'sprint from-to command ignores non-matching command',
        'sprint at 27 for 10 min',
        [ 'sprint', 'Number', 'to', 'Number' ],
        undefined
      ],
      [
        'sprint from-to command ignores due to missing words',
        'sprint :15',
        [ 'sprint', 'Number', 'to', 'Number' ],
        undefined,
      ],

    ]
  )


})
