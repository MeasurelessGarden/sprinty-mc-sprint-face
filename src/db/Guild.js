var _ = require('lodash')

import {Database} from './Database.js'

export class Guild {
  constructor(databaseUrl) {
    this.database = new Database(databaseUrl)
  }

  /*t.ensureTable('guild_config', [
  'guild_id              varchar(20) PRIMARY KEY',
  'sprint_channel_id     varchar(20)',
  'sprint_channel_date   date',
])
*/
  configureSprintChannel = (guildId, sprintChannelId, timestamp) => {
    this.database.put(
      // TODO change so that new timestamp updates the value! (and then put pinned messages in as appropriate - they shouldn't override newer database config values - just be a backup)
      'guild_config', // TODO do I just need a GuildTable template for this stuff?? Is that the output of changelog?? I have literally zero idea.
      {column: 'guild_id', value: guildId, type: 'string'},
      [
        {column: 'sprint_channel_id', value: sprintChannelId, type: 'string'},
        {
          column: 'sprint_channel_date',
          value: new Date(timestamp).toISOString(),
        },
      ]
    )
  }

  readConfiguredSprintChannel = (guildId, callback) => {
    this.database.get(
      'guild_config',
      {column: 'guild_id', value: guildId},
      [ 'sprint_channel_id', 'sprint_channel_date' ],
      callback
    )
  }
}
