import {Database} from './Database.js'

export const changelog = database => {
  if (database) {
    const t = new Database(database)
    t.ensureTable('guild_config', [
      'guild_id              varchar(20) PRIMARY KEY',
      'sprint_channel_id     varchar(20)',
      'sprint_channel_date   date',
    ])
    t.listTables() // TODO no guarentee that this ran *after* the previous command finished...
  }
  else {
    console.log('sorry no db for you!')
  }
}
