var _ = require('lodash')

const {Client} = require('pg')

export class Database {
  constructor(databaseUrl) {
    this.databaseUrl = databaseUrl
  }

  runQuery = (query, callback) => {
    const client = new Client({
      connectionString: this.databaseUrl,
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

  get = (name, id, values, callback) => {
    const selectQuery = `SELECT ${_.join(
      values,
      ', '
    )} FROM ${name} t WHERE t.${id.column} = '${id.value}'`

    this.runQuery(selectQuery, callback)
  };

  put = (name, id, values) => {
    const existsQuery = `SELECT * FROM ${name} t WHERE t.${id.column} = '${id.value}'`
    const insertQuery = `INSERT INTO ${name} VALUES (${_.join(
      // TODO use v.column also - need to look up synatx
      _.map(_.concat([ id ], values), v => {
        // if (v.type === 'string') {
        //   return `'${v.value}'`
        // }
        // if (!isNaN(parseFloat(v.value)) && isFinite(v.value)) {
        //   return v.value
        // }
        return `'${v.value}'`
      }),
      ', '
    )});`
    console.log('put', name, id, values)
    console.log('-> ', existsQuery)
    console.log('-> ', insertQuery)
    // console.log('???', _.map(values, v => {
    //   if (!isNaN(parseFloat(v.value)) && isFinite(v.value)) {
    //     return v
    //   }
    //   return `'${v.value}'`
    // }))

    this.runQuery(existsQuery, result => {
      if (result.rowCount == 0) {
        console.log('running insert query')
        this.runQuery(insertQuery, result => {
          console.log('insert result:', result)
        })
      }
      else {
        const valueList = _.join(
          _.map(values, v => {
            return `${v.column} = '${v.value}'`
          }),
          ', '
        )
        const updateQuery = `UPDATE ${name} SET ${valueList} WHERE ${id.column} = '${id.value}'`
        this.runQuery(updateQuery)
      }
    })
  }

  ensureTable = (name, columns) => {
    const existsQuery = `SELECT table_schema,table_name FROM information_schema.tables t WHERE t.table_name = '${name}'`
    const createQuery = `CREATE TABLE ${name} (${_.join(columns, ',\n')})`

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
