
const knex = require('../services/dbservice')

function addPathperiod(req,res){
  const gameperiodid=req.body.gameperiodid
  const pathid=req.body.pathid
  const i=req.body.i
  const numframes=req.body.numframes
  const going=req.body.going
  const passengercoaches=req.body.passengercoaches
  const goodscoaches=req.body.goodscoaches
  console.log(gameperiodid, typeof gameperiodid, pathid,typeof pathid,i,numframes,going,passengercoaches,goodscoaches)
  knex('pathperiod')
  .insert({gameperiodid, pathid, i, numframes, going, passengercoaches, goodscoaches})
  .returning('id')
  .on(`query`,(q)=>{
    console.log(`query for addPathperiod: ${q.sql}`)
  })
  .then(data=>{
    res.json(data)
  })
  .catch(err => {
    console.log(`Error in addPathPeriod ${err}`)
    res.sendStatus(500)
  })
}
  
module.exports = {
  addPathperiod
}