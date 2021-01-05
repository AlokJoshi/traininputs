require('dotenv').config()

let types = require('pg').types
types.setTypeParser(20, function (val) {
  return parseInt(val)
})

let knex = require('knex')({
  client: 'pg',
  version: '9.6',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    //ssl:true
  },
  //debug:true
});

knex.raw("SELECT 1;").then(() => {
  console.log(`Success in connecting to the database`)
}).catch((err) => {
  console.log(`Error in connecting to the database: ${err}`)
  process.exit()
})

module.exports = knex