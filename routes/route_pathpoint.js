const knex = require('../services/dbservice')
function getPathpointGivenPathid(req, res) {
  const pathid = req.params.pathid
  knex('pathpoint')
    .where('pathid', pathid)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.sendStatus(500)
    })
}
function addPathpoint(req, res) {
  const pathid = req.body.pathid
  const x = req.body.x
  const y = req.body.y
  console.log(`app.post("/api/pathpoint",pathid:${pathid},${x},${y}`)
  knex('pathpoint')
    .insert({ pathid, x, y })
    .returning('id')
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.sendStatus(500)
    })
}

  module.exports = {
    getPathpointGivenPathid,
    addPathpoint
}