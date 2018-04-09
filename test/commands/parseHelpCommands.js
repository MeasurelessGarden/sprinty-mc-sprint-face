var _ = require('lodash')
import {unroll} from '../spec.js'
import {helpIntro, helpCommands} from '../../src/commands/helpCommand.js'
import {createObjFromMessage} from '../../src/commands/parseUtils.js'
import {expect} from 'chai'

// TODO unroll based on examples!

describe('Parse Help Command', function(){
  describe('basic help command', function(){
    it('generates examples for help', function(){
      const reply = createObjFromMessage(helpCommands, 'help example', 0)
      expect(reply).to.be.equals(`help examples:

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
\t\`show sprint examples\` - straight-forward`)
    })

    it('generates a help message', function(){
      const reply = createObjFromMessage(helpCommands, 'help', 0)
      expect(reply).to.be.equals(`**Welcome to Sprinty McSprintFace!**

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
\tGet more info on managing sprints. This command must be in a DM.

help examples
help example
show examples
show example
\tGet examples.

help [COMMAND] examples
help [COMMAND] example
show [COMMAND] examples
show [COMMAND] example
\tCOMMAND - must be one of: sprint
\tGet examples for commands.`)
    })
  })

  describe('help sprint command', function(){
    it('generates examples for sprints', function(){
      const reply = createObjFromMessage(helpCommands, 'help sprint example', 0)
      expect(reply).to.be.equals(`sprint examples:

sprint [START TIME]
\t\`sprint 15\` - straight-forward
\t\`sprint :15\` - with clock-minute notation
\t\`sprint -15\` - deceptive negatives

sprint at [START TIME]
\t\`ANYONE WANT TO SPRINT AT 25?\` - enthusiastic
\t\`sprinting around 25?\` - alternate wording
\t\`I want to sprint at :45\` - natural
\t\`sprint at 20\` - straight-forward
\t\`sprint at 25\` - straight-forward
\t\`sprint at 30\` - straight-forward
\t\`sprint at 59\` - end of the hour

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
\t\`sprint in 60 for 60 minutes\` - straight-forward`)
    })

    it('generates a help message for sprints', function(){
      const reply = createObjFromMessage(helpCommands, 'help sprint', 0)
      expect(reply).to.be.equals(`There are many valid ways to start a sprint.

commands:

sprint [START TIME]
\tSTART TIME (minutes of hour) - must be in the range [0:59]
\tStart time is always assumed to be in the future, so the final result will jump forward by an hour if needed to create a valid sprint. Sprints default to 30 min.

sprint at [START TIME]
sprint around [START TIME]
sprinting at [START TIME]
sprinting around [START TIME]
\tSTART TIME (minutes of hour) - must be in the range [0:59]
\tStart time is always assumed to be in the future, so the final result will jump forward by an hour if needed to create a valid sprint. Sprints default to 30 min.

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
\tStart a sprint in a few minutes (up to an hour).`)
    })
  })
})
