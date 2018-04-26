import {Database} from './Database.js'

// TODO package.json should have an 'npm run changelog' option to run this - it has timing issues with running as part of bot startup
export const changelog = database => {
  if (database) {
    const t = new Database(database)
    // t.dropTable('guild_config')
    t.ensureTable('guild_config', [
      'guild_id              char(18) PRIMARY KEY',
      'sprint_channel_id     char(18)',
      'sprint_channel_date   date', // TODO recreate with TIMESTAMP WITH TIME ZONE
    ])
    t.listTables() // TODO no guarentee that this ran *after* the previous command finished...
  }
  else {
    console.log('sorry no db for you!')
  }
}
