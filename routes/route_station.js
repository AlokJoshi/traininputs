const knex = require('../services/dbservice')
function getStationsGivenPathid(req, res){
    const pathid = req.params.pathid
    knex('station')
      .where('pathid', pathid)
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        res.sendStatus(500)
      })
  }
  function addStation (req, res) {
    const pathid = req.body.pathid
    const name = req.body.name
    const wpn = req.body.wpn
    const x = req.body.x
    const y = req.body.y
    console.log(`app.post("/api/station",pathid:${pathid},name:${name},wpn:${wpn},x:${x},y:${y}`)
    knex('station')
      .insert({ pathid, name, wpn, x, y })
      .returning('id')
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        console.log(`Error in addStation: ${err}`)
        res.sendStatus(500)
      })
  }

  module.exports = {
    getStationsGivenPathid,
    addStation
}