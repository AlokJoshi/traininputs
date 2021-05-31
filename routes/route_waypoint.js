const knex = require('../services/dbservice')
function getWaypointGivenPathid (req, res) {
  const pathid = req.params.pathid
  knex('waypoint')
  .where('pathid', pathid)
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(500)
  })
}
function addWaypoint (req, res) {
  const pathid = req.body.pathid
  const n = req.body.n
  const x = req.body.x
  const y = req.body.y
  const feature = req.body.feature
  console.log(`app.post("/api/waypoint",pathid:${pathid},${n},${x},${y},${feature}`)
  knex('waypoint')
  .insert({ pathid, n , x, y, feature })
  .returning('id')
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.sendStatus(500)
  })
}

  module.exports = {
    getWaypointGivenPathid,
    addWaypoint
}