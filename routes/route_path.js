
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
function getPathsGivenGameId(req,res){
  const gameid = req.params.gameid
  knex('path')
  .where('gameid', gameid)
  .then(data => {
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

  let wparray = req.body.wparray
  wparray = JSON.stringify(wparray)
  wparray = wparray.replace('[','{')
  wparray = wparray.replace(']','}')
  wparray = wparray.replace(/"/g,"'")

  //console.log(`addPath called with ${gameid},${routenumber},${finalized},${pathpoints}`)
  knex('path')
  .insert({
    gameid, routenumber, finalized, pathpoints, wparray
  })
  .returning('id')
  .then(data=>{
    res.send(data)
  })
  .catch(err => {
    console.log(`Error in addPath: ${err}`)
    res.sendStatus(500)
  })
}
function updatePath(req,res){
  const pathid=req.body.pathid
  const gameperiodid=req.body.gameperiodid
  const i=req.body.i
  const numframes=req.body.numframes
  const going=req.body.going
  const passengercoaches=req.body.passengercoaches
  const goodscoaches=req.body.goodscoaches||0
  let parray = req.body.passengers
  if(parray){
    parray = JSON.stringify(parray)
    //console.log(parray)
    parray = parray.replace('[','{')
    parray = parray.replace(']','}')
    parray = parray.replace(/"/g,"'")
  }
  knex('path')
  .where('id',pathid)
  .update({i, numframes, going, passengercoaches, goodscoaches, parray})
  // .on(`query`,(q)=>{
  //   console.log(`query for updatePath: ${q.sql}`)
  // })
  .then(data=>{
    res.json(data)
  })
  .catch(err => {
    console.log(`Error in updatePath: ${err}`)
    res.sendStatus(500)
  })
}
module.exports = {
  getPath,
  getPathsGivenGameId,
  addPath,
  updatePath
}