var _ = require('lodash')
import {unroll} from '../spec.js'
import {helpIntro, helpCommands} from '../../src/commands/helpCommand.js'
// import {
//   generateHelp,
// } from '../../src/commands/helpUtils.js'
import {createObjFromMessage} from '../../src/commands/parseUtils.js'
import {expect} from 'chai'

// const unrollCommandExamples = _.map(
//   _.flatMap(sprintCommands, command => {
//     return _.map(command.examples, example => {
//       return {ex: example, config: command}
//     })
//   }),
//   unroll => {
//     return [
//       unroll.config,
//       unroll.ex,
//       `**Welcome to Sprinty McSprintFace!**
//
// First up: typing '<@430905454961623060> help' or 'help <@430905454961623060>' will make this goofy bot try to help you!
//
// Note, for spam reasons, Sprinty will only reply to you in a DM! Please DM Sprinty directly instead of spamming a busy channel!
//
// Xe acknowledges commands with reactions, so that's how you'll know if Sprinty heard you!
//
// Sprinty parses many commands out of normally phrased text, so it's important to dig through the help and figure out how to say what you mean, and understand the places where xe can get it hilariously wrong.
//
// commands:
//
// help
// \t(bet you figured out this one!) Please always ask for help in a DM to Sprinty.`,
//     ]
//   }
// )

describe('Parse Help Command', function(){

  describe('basic help command', function() {
    it('generates a help message', function () {
      const reply = createObjFromMessage(helpCommands, 'help', 0)
      console.log('..... HALP MEH')
      console.log(reply)
      expect(reply).to.be.equals(`**Welcome to Sprinty McSprintFace!**

First up: typing '<@430905454961623060> help' or 'help <@430905454961623060>' will make this goofy bot try to help you!

Note, for spam reasons, Sprinty will only reply to you in a DM! Please DM Sprinty directly instead of spamming a busy channel!

Xe acknowledges commands with reactions, so that's how you'll know if Sprinty heard you!

Sprinty parses many commands out of normally phrased text, so it's important to dig through the help and figure out how to say what you mean, and understand the places where xe can get it hilariously wrong.

commands:

help [COMMAND]
\tCOMMAND - must be one of: sprint
\tGet more info on managing sprints.

help
\t(bet you figured out this one!) Please always ask for help in a DM to Sprinty.`)
    })
  })

  describe('help sprint command', function() {
    it('generates a help message for sprints', function () {
      const reply = createObjFromMessage(helpCommands, 'help sprint', 0)
      expect(reply).to.be.equals(`There are many valid ways to start a sprint.

commands:

sprint at [START TIME] to [END TIME]
\tSTART TIME (minutes of hour) - must be in the range [0:59]
\tEND TIME (minutes of hour) - must be in the range [0:59]
\tStart and end times are always assumed to be in the future and correctly ordered, so the final result will jump forward by an hour if needed to create a valid sprint.

sprint [START TIME] to [END TIME]
\tSTART TIME (minutes of hour) - must be in the range [0:59]
\tEND TIME (minutes of hour) - must be in the range [0:59]
\tStart and end times are always assumed to be in the future and correctly ordered, so the final result will jump forward by an hour if needed to create a valid sprint.

sprint at [START TIME] for [DURATION]
\tSTART TIME (minutes of hour) - must be in the range [0:59]
\tDURATION (minutes) - must be in the range [1:60]
\tStart time is always assumed to be in the future, so the final result will jump forward by an hour if needed to create a valid sprint. Sprints cannot be longer than an hour.

sprint [START TIME] for [DURATION]
\tSTART TIME (minutes of hour) - must be in the range [0:59]
\tDURATION (minutes) - must be in the range [1:60]
\tStart time is always assumed to be in the future, so the final result will jump forward by an hour if needed to create a valid sprint. Sprints cannot be longer than an hour.

sprint at [START TIME]
\tSTART TIME (minutes of hour) - must be in the range [0:59]
\tStart time is always assumed to be in the future, so the final result will jump forward by an hour if needed to create a valid sprint. Sprints default to 30 min.

sprint [START TIME]
\tSTART TIME (minutes of hour) - must be in the range [0:59]
\tStart time is always assumed to be in the future, so the final result will jump forward by an hour if needed to create a valid sprint. Sprints default to 30 min.`)
    })
  })
  // describe('self describing generated tests', function(){
    // unroll(
    //   'creates sprint from #example.input', // (#example.name) with #command.vocabulary',
    //   function(done, args){
    //     const sprint = createObjFromMessage(
    //       sprintCommands,
    //       args.example.input,
    //       1523059200000 // zero hour day, to make it easy to compute expected times (see above hacky thing to generate the unroll)
    //     )
    //
    //     expect(sprint).to.be.equalSprintDefinition(args.expected)
    //     done()
    //   },
    //   _.concat([ [ 'command', 'example', 'expected' ] ], unrollCommandExamples)
    // )
  // })

})