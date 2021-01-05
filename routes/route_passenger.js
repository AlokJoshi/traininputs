const knex = require('../services/dbservice')
function getPassengersGivenPathid(req, res) {
  const pathid = req.params.pathid
  knex('passenger')
    .where('pathid', pathid)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.sendStatus(500)
    })
}
function addPassengers(req, res) {
  const pathperiodid = req.body.pathperiodid
  let passengers = req.body.passengers
  console.log(passengers)
  passengers = JSON.stringify(passengers)
  console.log(passengers)
  passengers = passengers.replace('[','{')
  passengers = passengers.replace(']','}')
  passengers = passengers.replace(/"/g,"'")
  console.log(`app.post("/api/passenger after string manipulation",passengers:${passengers}`)
  knex('passenger')
    .insert({ pathperiodid, "parray":passengers })
    .returning('id')
    .on('query',query=>{
      console.log(query.sql)
    })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log(`app.post("/api/passenger",error:${err}`)
      res.sendStatus(500)
    })
}

module.exports = {
  getPassengersGivenPathid,
  addPassengers
}