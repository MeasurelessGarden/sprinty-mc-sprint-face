var _ = require('lodash')

const {Client} = require('pg')

export class Tables {
  constructor(database) {
    this.database = database
  }

  runQuery = (query, callback) => {
    const client = new Client({
      connectionString: this.database,
      ssl: true,
    })

    client.connect()

    client.query(query, (err, result) => {
      if (err) {
        console.error(err)
      }
      if (callback) {
        callback(result)
      }
      client.end()
    })
  }

  ensureTable = (name, columns) => {
    const existsQuery = `SELECT table_schema,table_name FROM information_schema.tables t WHERE t.table_name = '${name}'`
    const createQuery = `CREATE TABLE ${name} (${_.join(columns, ',\n')});`

    this.runQuery(existsQuery, result => {
      if (result.rowCount == 0) {
        this.runQuery(createQuery)
      }
      else {
        console.log('table', name, 'already exists') //, result)
      }
    })
  }

  listTables = () => {
    const listQuery = `SELECT table_schema,table_name FROM information_schema.tables t WHERE t.table_schema = 'public'`
    this.runQuery(listQuery, result => {
      console.log('TABLES:')

      _.each(result.rows, row => {
        console.log(JSON.stringify(row))
      })
    })
  }

  dropTable = name => {
    const existsQuery = `SELECT table_schema,table_name FROM information_schema.tables t WHERE t.table_name = '${name}'`
    const dropQuery = `DROP TABLE ${name}`
    this.runQuery(existsQuery, result => {
      if (result.rowCount != 0) {
        this.runQuery(dropQuery)
      }
      else {
        console.log('table', name, 'does not exist') //, result)
      }
    })
  }
}
