
const knex = require('../services/dbservice')
// function ConvertBackToArray(data){
//   data.forEach(d => {
//     let stations = d.starray
//     stations.forEach( st => {
//       st = JSON.stringify(st)
//       st = st.replace('{','[')
//       st = st.replace('}',']')
//       st = st.replace(/'/g,"") 
//       console.log(st) 
//     })  
//   });
//   console.log(data)
// }
function getPath(req,res){
  const id = req.params.id
  const query = `select routenumber,finalized,pathpoints, 
                 passengercoaches,goodscoaches,i,numframes,going,
                 array_to_json(parray) as pa,array_to_json(wparray) as wa,
                 array_to_json(starray) as sa from path where id = ${id}`
  knex.raw(query)
  .then(data => {
    console.log(data)
    res.send(data)
  })
  .catch(err => {
    console.log(`Error in getPath: ${err}`)
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
  // pathpoints = JSON.stringify(pathpoints)
  // pathpoints = pathpoints.replace('[','{')
  // pathpoints = pathpoints.replace(']','}')
  // pathpoints = pathpoints.replace(/"/g,"'")

  let wparray = req.body.wparray
  // wparray = JSON.stringify(wparray)
  // wparray = wparray.replace('[','{')
  // wparray = wparray.replace(']','}')
  // wparray = wparray.replace(/"/g,"'")

  let starray = req.body.starray
  // starray = JSON.stringify(starray)
  // starray = starray.replace('[','{')
  // starray = starray.replace(']','}')
  // starray = starray.replace(/"/g,"'")

  //console.log(`addPath called with ${gameid},${routenumber},${finalized},${pathpoints}`)
  knex('path')
  .insert({
    gameid, routenumber, finalized, pathpoints, wparray, starray
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
  const i=req.body.i
  const numframes=req.body.numframes
  const going=req.body.going
  const passengercoaches=req.body.passengercoaches
  const goodscoaches=req.body.goodscoaches||0
  let parray = req.body.passengers
  
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