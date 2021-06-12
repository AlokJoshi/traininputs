
const knex = require('../services/dbservice')

function getleaderboard(req,res){
  let periods=req.params.periods
  console.log(periods)
  periods=periods.split(',')
  let query=''
  for(let pd=0;pd<periods.length;pd++){
    if(query){
      query += ' union '
    }
    query += `(select period,openingcash,email from gameperiod gp inner join game g on g.id = gp.gameid where gp.period = ${periods[pd]} order by openingcash desc limit 3) `
  }
  query += ' order by period asc, openingcash desc'
  knex.raw(query)
  .then(data=>{
    res.json(data)
  })
  .catch(err => {
    console.log(`Error in getleaderboard: ${err}`)
    res.sendStatus(500)
  })
}
  
module.exports = {
  getleaderboard
}