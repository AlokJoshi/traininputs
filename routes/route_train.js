const knex = require('../services/dbservice')
function getTrainGivenPathid (req, res) {
  const pathid = req.params.pathid
  knex('train')
    .where('pathid', pathid)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.sendStatus(500)
    })
}
function addTrain (req, res) {
  const pathid = req.body.pathid
  const passengercoaches = req.body.passengercoaches
  const goodscoaches = req.body.goodscoaches
  console.log(`app.post("/api/train",pathid:${pathid},${passengercoaches},${goodscoaches}`)
  knex('train')
    .insert({ pathid, passengercoaches, goodscoaches})
    .returning('id')
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.sendStatus(500)
    })
}
  module.exports = {
    getTrainGivenPathid,
    addTrain
}