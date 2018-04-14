var _ = require('lodash')
import {unroll} from '../spec.js'
import {helpIntro, helpCommands} from '../../src/commands/helpCommand.js'
import {createObjFromMessage} from '../../src/utils/parseUtils.js'
import {assert, expect} from 'chai'

const unrolledExamples = _.flatMap(helpCommands, command => {
  return _.flatMap(command.examples, example => {
    return _.map(example.tests, test => {
      return [
        // calledAt date is the zeroth hour of the day, to make the startHour, endHour easy to predict from example definitions
        command,
        example.tags,
        example.input,
        test.instructions,
      ]
    })
  })
})

const unrolledExamplesWithHeader = _.concat(
  [ [ 'command', 'tags', 'input', 'expected' ] ],
  unrolledExamples
)

const unrollUntestedExamples = _.filter(
  _.flatMap(helpCommands, command => {
    return _.map(command.examples, example => {
      if (!example.tests) {
        return [ command, example.input ]
      }
    })
  }),
  it => it
)

describe('Parse Help Command', function(){
  describe('self describing generated tests', function(){
    it('has no untested examples', function(){
      expect(unrollUntestedExamples.length).to.be.equal(0)
    })

    unroll(
      'creates help from #input - expects #expected instructions',
      function(done, args){
        const help = createObjFromMessage(
          helpCommands,
          args.input,
          1523059200000
        )
        expect(help.length).to.be.equal(args.expected)
        done()
      },
      unrolledExamplesWithHeader
    )
  })

  describe('basic help command', function(){
    it('generates examples for help', function(){
      const reply = createObjFromMessage(helpCommands, 'help example', 0)
      expect(_.join(reply, '\n\n')).to.be.equals(`help examples:

help
\t\`help\` - basic
\t\`will u help me?\` - natural inquery
\t\`help me plz\` - natural
\t\`YO HELP\` - natural insistant

help [COMMAND]
\t\`help sprint\` - sprint
\t\`help me create a sprint\` - sprint natural

help examples
\t\`help examples\` - straight-forward
\t\`help example\` - straight-forward
\t\`show examples\` - straight-forward

help [COMMAND] examples
\t\`help sprint examples\` - straight-forward
\t\`help sprint example\` - straight-forward
\t\`show sprint examples\` - straight-forward
\t\`show me some sprint examples\` - natural`)
    })

    it('generates a help message', function(){
      const reply = createObjFromMessage(helpCommands, 'help', 0)
      expect(_.join(reply, '\n\n')).to.be
        .equals(`**Welcome to Sprinty McSprintFace!**

First up: typing '<@430905454961623060> help' or 'help <@430905454961623060>' will make this goofy bot try to help you!

Note, for spam reasons, Sprinty will only reply to you in a DM! Please DM Sprinty directly instead of spamming a busy channel!

Xe acknowledges commands with reactions, so that's how you'll know if Sprinty heard you!

Sprinty parses many commands out of normally phrased text, so it's important to dig through the help and figure out how to say what you mean, and understand the places where xe can get it hilariously wrong.

Capitalization and punctation don't matter. Not to xem, anyway.

commands:

help
halp
\t(bet you figured out this one!) Please always ask for help in a DM to Sprinty.

help [COMMAND]
halp [COMMAND]
\tCOMMAND - must be one of: sprint
\tGet more info on running commands. This command must be in a DM.

help examples
help example
show examples
show example
\tGet examples. This command must be in a DM.

help [COMMAND] examples
help [COMMAND] example
show [COMMAND] examples
show [COMMAND] example
\tCOMMAND - must be one of: sprint
\tGet examples for commands. This command must be in a DM.`)
    })
  })

  describe('help sprint command', function(){
    it('generates examples for sprints', function(){
      const reply = createObjFromMessage(helpCommands, 'help sprint example', 0)
      expect(_.join(reply, '\n\n')).to.be.equals(`sprint examples:

sprint [START TIME]
\t\`sprint 15\` - straight-forward
\t\`sprint :15\` - with clock-minute notation
\t\`sprint -15\` - deceptive negatives

sprint now
\t\`sprint now\` - straight-forward
\t\`lets sprint right now!\` - natural

sprint at [START TIME]
\t\`ANYONE WANT TO SPRINT AT 25?\` - enthusiastic
\t\`sprinting around 25?\` - alternate wording
\t\`I want to sprint at :45\` - natural
\t\`sprint at 20\` - straight-forward
\t\`sprint at 25\` - straight-forward
\t\`sprint at 30\` - straight-forward
\t\`sprint at 59\` - end of the hour

sprint for [DURATION]
\t\`sprint for 32 minutes\` - implies: start now
\t\`sprint for 12\` - implies: start now

sprint now for [DURATION]
\t\`sprint now for 32\` - straight-forward

sprint now to [END TIME]
\t\`sprint now until 32\` - straight-forward
\t\`well i'm sprinting now to :55\` - natural

sprint to [END TIME]
\t\`sprint until 15\` - straight-forward

sprint [START TIME] for [DURATION]
\t\`sprint 57 for 32\` - uncommon start and stop time
\t\`shall we sprint :20 for about 55 min?\` - natural and verbose, with clock notation
\t\`sprint 30 for 34 minutes\` - simple
\t\`sprint 30 for 1 hour\` - confusing (deceptive), the word hour is ignored
\t\`sprint 15 for 20\` - straight-forward
\t\`sprint 15 for 1.5 minutes\` - deceptive punctuation (interpreted as sprint 15 for 1 and the 5 is nonsense)

sprint at [START TIME] for [DURATION]
\t\`sprint at 25 for 30?\` - natural inquery
\t\`sprinting around 25 for 30?\` - alternate wording
\t\`sprint at 27 for 10 min\` - 10 minute sprint
\t\`sprint at 20 for 6 min\` - short and sweet
\t\`sprint at 30 for 14\` - straight-forward
\t\`sprint at 35 for 14\` - straight-forward
\t\`sprint at 55 for 55\` - long running
\t\`sprint at 30 for 34 minutes\` - slightly longer than default
\t\`sprint at 10 for 60\` - maximum length sprint
\t\`sprint at 10 for 1\` - very short sprint

sprint [START TIME] to [END TIME]
\t\`let's sprint 40 to 45\` - natural
\t\`sprinting 40 until 45\` - alternate wording
\t\`sprint from 13 to 29??\` - natural, question
\t\`sprint 15 to 25\` - straight-forward
\t\`sprint 15 to :35\` - clock notation
\t\`sprint at 10 to 11\` - very short
\t\`sprint 10 to 10\` - implied hour

sprint at [START TIME] to [END TIME]
\t\`sprint at :15 to :45\` - straight-forward
\t\`sprint at :15 until :45\` - alternate wording: until
\t\`sprint at 15 with extra 5 number to 30\` - potentially confusing extra numbers (maybe deceptive)
\t\`sprinting around 15 to 30\` - alternate wording: sprinting around
\t\`anyone want to sprint at :15 to :45?\` - verbose and natural
\t\`sprint at 35 to 20\` - wraps to next hour
\t\`sprint at 10 to 59\` - to the end of the hour
\t\`sprint at 10 to 0\` - to the beginning of the next hour
\t\`sprint at 10 to 00\` - using two digits for minutes

sprint in [DELTA]
\t\`sprint in 15\` - straight-forward

sprint in [DELTA] for [DURATION]
\t\`sprint in 15 for 20\` - straight-forward
\t\`sprint in 60 for 15\` - straight-forward
\t\`sprint in 60 for 60 minutes\` - straight-forward

sprint info
\t\`sprint info\` - straight-forward
\t\`gimme the sprint info plz~!!\` - natural
\t\`sprint info now\` - careful!

cancel sprint
\t\`cancel sprint\` - straight-forward
\t\`stop sprint\` - straight-forward
\t\`plz stop the sprint i can't take it!!!\` - natural
\t\`cancel sprint now\` - careful!
\t\`cancel sprint info now\` - careful!`)
    })

    it('generates a help message for sprints', function(){
      const reply = createObjFromMessage(helpCommands, 'help sprint', 0)
      expect(_.join(reply, '\n\n')).to.be
        .equals(`There are many valid ways to manage a sprint.

commands:

sprint [START TIME]
\tSTART TIME (minutes of hour) - must be in the range [0:59]
\tStart time is always assumed to be in the future, so the final result will jump forward by an hour if needed to create a valid sprint. Sprints default to 30 min.

sprint now
\tStart a sprint now. Sprints default to 30 min.

sprint at [START TIME]
sprint around [START TIME]
sprinting at [START TIME]
sprinting around [START TIME]
\tSTART TIME (minutes of hour) - must be in the range [0:59]
\tStart time is always assumed to be in the future, so the final result will jump forward by an hour if needed to create a valid sprint. Sprints default to 30 min.

sprint for [DURATION]
sprinting for [DURATION]
\tDURATION (minutes) - must be in the range [1:60]
\tStart a sprint now for the specfied number of minutes (up to an hour).

sprint now for [DURATION]
sprinting now for [DURATION]
\tDURATION (minutes) - must be in the range [1:60]
\tStart a sprint now for the specfied number of minutes (up to an hour).

sprint now to [END TIME]
sprint now until [END TIME]
sprinting now to [END TIME]
sprinting now until [END TIME]
\tEND TIME (minutes of hour) - must be in the range [0:59]
\tStart a sprint now until the specified end time.

sprint to [END TIME]
sprint until [END TIME]
sprinting to [END TIME]
sprinting until [END TIME]
\tEND TIME (minutes of hour) - must be in the range [0:59]
\tStart a sprint now until the specified end time.

sprint [START TIME] for [DURATION]
sprinting [START TIME] for [DURATION]
\tSTART TIME (minutes of hour) - must be in the range [0:59]
\tDURATION (minutes) - must be in the range [1:60]
\tStart time is always assumed to be in the future, so the final result will jump forward by an hour if needed to create a valid sprint. Sprints cannot be longer than an hour.

sprint at [START TIME] for [DURATION]
sprint around [START TIME] for [DURATION]
sprinting at [START TIME] for [DURATION]
sprinting around [START TIME] for [DURATION]
\tSTART TIME (minutes of hour) - must be in the range [0:59]
\tDURATION (minutes) - must be in the range [1:60]
\tStart time is always assumed to be in the future, so the final result will jump forward by an hour if needed to create a valid sprint. Sprints cannot be longer than an hour.

sprint [START TIME] to [END TIME]
sprint [START TIME] until [END TIME]
sprinting [START TIME] to [END TIME]
sprinting [START TIME] until [END TIME]
\tSTART TIME (minutes of hour) - must be in the range [0:59]
\tEND TIME (minutes of hour) - must be in the range [0:59]
\tStart and end times are always assumed to be in the future and correctly ordered, so the final result will jump forward by an hour if needed to create a valid sprint.

sprint at [START TIME] to [END TIME]
sprint at [START TIME] until [END TIME]
sprint around [START TIME] to [END TIME]
sprint around [START TIME] until [END TIME]
sprinting at [START TIME] to [END TIME]
sprinting at [START TIME] until [END TIME]
sprinting around [START TIME] to [END TIME]
sprinting around [START TIME] until [END TIME]
\tSTART TIME (minutes of hour) - must be in the range [0:59]
\tEND TIME (minutes of hour) - must be in the range [0:59]
\tStart and end times are always assumed to be in the future and correctly ordered, so the final result will jump forward by an hour if needed to create a valid sprint.

sprint in [DELTA]
sprinting in [DELTA]
\tDELTA (minutes) - must be in the range [1:60]
\tStart a sprint in a few minutes (up to an hour). Sprints default to 30 min.

sprint in [DELTA] for [DURATION]
sprinting in [DELTA] for [DURATION]
\tDELTA (minutes) - must be in the range [1:60]
\tDURATION (minutes) - must be in the range [1:60]
\tStart a sprint in a few minutes (up to an hour).

sprint info
\tGet information on the configured sprint.

cancel sprint
stop sprint
\tThere's not much to cancelling sprints.`)
    })
  })
})
