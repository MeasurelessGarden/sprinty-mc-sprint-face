import {Tables} from './Table.js'

export const changelog = database => {
  if (database) {
    const t = new Tables(database)
    t.listTables()
    // t.ensureTable('guild_config', [
    //   'guild_id              varchar(20) PRIMARY KEY',
    //   'sprint_channel_id     varchar(20)',
    //   'sprint_channel_date   date'])
    t.dropTable('guild_config')
    t.listTables()
  }
  else {
    console.log('sorry no db for you!')
  }
}
