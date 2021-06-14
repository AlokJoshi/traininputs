
const knex = require('../services/dbservice')

function getleaderboard(req,res){
  let periods=req.params.periods
  let email=req.params.email
  console.log(periods)
  periods=periods.split(',')
  let query=''
  for(let pd=0;pd<periods.length;pd++){
    if(query){
      query += ' union '
    }
    query += `(select period,openingcash,email,rank () over (order by openingcash desc) rank_number from gameperiod gp inner join game g on g.id = gp.gameid where gp.period = ${periods[pd]} ) `
  }
  query = "(" + query + ") as mytable "

  let finalQuery = `Select period,openingcash,email,rank_number from ${query} where rank_number<4 or email='${email}'`
  knex.raw(finalQuery)
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