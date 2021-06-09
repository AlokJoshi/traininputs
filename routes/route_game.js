
const knex = require('../services/dbservice')
function getAll (req, res) {
    knex('game')
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        res.sendStatus(500)
      })
  }
function getGameWithId(req, res) {
    const id = req.params.id
    knex('game')
      .where('id', id)
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        res.sendStatus(500)
      })
  }
  function getGameForUserGivenEmail(req, res) {
    const email = req.params.email
    console.log(`app.get("/api/games/email/:email", email:${email}`)
    knex('game')
      .where('email',email)
      .then(data => {
        console.log(`Games retrieved for email:${email}:${data}`)
        res.send(data)
      })
      .catch(err => {
        res.sendStatus(500)
      })
  }
  function addGame (req, res) {
    const email = req.body.email
    const gamename = req.body.gamename
    console.log(`app.post("/api/game",email:${email},${gamename}`)
    knex('game')
      .insert({ email, gamename })
      .returning('id')
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        res.sendStatus(500)
      })
  }
  function deleteGame(req, res){
    const id = req.params.id
    knex('game')
      .where({ id })
      .delete()
      .then(data => {
        res.sendStatus(200)
      })
      .catch(err => {
        res.sendStatus(500)
      })
  }
  function updateName(req, res) {
    const id = req.body.id
    const name = req.body.name
    console.log(`app.put("/api/game", id:${id}, name:${name}`)
    knex('game')
      .where('id',id)
      .update({gamename:name})
      .then(data => {
        console.log(`game renamed`)
        res.sendStatus(200)
      })
      .catch(err => {
        console.log(`Error in updateName: ${err}`)
        res.sendStatus(500)
      })
  }
module.exports = {
    getAll,
    getGameWithId,
    getGameForUserGivenEmail,
    addGame,
    deleteGame,
    updateName
}