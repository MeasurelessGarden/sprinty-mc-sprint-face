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
    this.database.put('guild_config', {column: 'guild_id', value: guildId}, [
      {column: 'sprint_channel_id', value: sprintChannelId},
      {column: 'sprint_channel_date', value: new Date(timestamp)},
    ])
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
