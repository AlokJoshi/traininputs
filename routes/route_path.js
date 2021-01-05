
const knex = require('../services/dbservice')
function getPath(req,res){
  const id = req.params.id
  knex('path')
    .where('id', id)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.sendStatus(500)
    })
}
function getPathsGivenGameperiodId(req,res){
  const gameperiodid = req.params.gameperiodid
  knex('path')
    .where('gameperiodid', gameperiodid)
    .then(data => {period
      res.send(data)
    })
    .catch(err => {
      res.sendStatus(500)
    })
}
function addPath(req,res){
  const gameid = req.body.gameid
  const routenumber = req.body.routenumber
  const finalized = req.body.finalized

  let pathpoints = req.body.points
  pathpoints = JSON.stringify(pathpoints)
  pathpoints = pathpoints.replace('[','{')
  pathpoints = pathpoints.replace(']','}')
  pathpoints = pathpoints.replace(/"/g,"'")

  

  console.log(`addPath called with ${gameid},${routenumber},${finalized},${pathpoints}`)
  knex('path')
  .insert({
    gameid, routenumber, finalized, pathpoints
  })
  .returning('id')
  .then(data=>{
    res.send(data)
  })
  .catch(err => {
    console.log(`addPath err:${err}`)
    res.sendStatus(500)
  })
}
module.exports = {
  getPath,
  getPathsGivenGameperiodId,
  addPath
}