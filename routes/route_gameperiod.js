
const knex = require('../services/dbservice')

function addGameperiod(req, res) {
  const gameid = req.body.gameid
  const period = req.body.period
  const openingcash = req.body.openingcash
  const openingcumcapitalcost = req.body.openingcumcapitalcost
  const openingcumdepreciation = req.body.openingcumdepreciation
  const cumtrackcost = req.body.cumtrackcost
  const cumstationcost = req.body.cumstationcost
  const costs = req.body.costs
  const sales = req.body.sales
  const interest = req.body.interest
  const tax = req.body.tax
  const profit = req.body.profit
  const cumcoachcost = req.body.cumcoachcost
  const cumenginecost = req.body.cumenginecost
  console.log(`addGameperiod called with ${gameid},${period},${sales},${interest}`)
  knex('gameperiod')
    .insert({ gameid, period, openingcash, openingcumcapitalcost, 
              openingcumdepreciation, cumtrackcost, cumstationcost,
              costs, sales, interest, tax, profit, cumcoachcost, cumenginecost})
    .returning('id')
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      console.log(`addGameperiod err:${err}`)
      res.sendStatus(500)
    })
}
function getHighestPeriodGivenGameid(req, res) {
  const gameid = req.params.gameid
  const query = `select period from gameperiod 
                     where id = (
                       select max(id) from gameperiod
                       where gameid = ${gameid}
                     )`
  knex.raw(query)
    .on('query', query => console.log(query.sql))
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })

  // knex('gameperiod')
  // .select(knex.raw('max(id)'))
  // .where('gameid',gameid)
  // .then(data=>{
  //   const id = data[0].max
  //   console.log(id)
  //   knex('gameperiod')
  //   .select('period')
  //   .where('id',id)
  //   .on('query',query=>{
  //     console.log(query.sql)
  //   })
  //   .then(data=>{
  //     res.send(data.period)
  //   })
  //   .catch(err => {
  //     console.log(err)
  //     res.sendStatus(500)
  //   })
  // })
  // .catch(err=>{
  //   console.log(err)
  //   res.sendStatus(500)
  // })
}
module.exports = {
  getHighestPeriodGivenGameid,
  addGameperiod
}