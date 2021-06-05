
const knex = require('../services/dbservice')
function getAll(req, res) {
  knex('user')
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.sendStatus(500)
    })
}
function getUserWithEmail(req, res) {
  const email = req.params.email
  knex('user')
    .select('email')
    .where('email', email)
    .on('query',(q)=>{
      console.log(`SQL in getUserWithEmail with email: ${email}: ${q.sql}`)
    })
    .then(data => {
      console.log(`Data in getUserWithEmail with email: ${email}: ${data}`)
      res.json(data)
    })
    .catch(err => {
      console.log(`Error in getUserWithEmail with email: ${email}: ${err}`)
      res.sendStatus(500)
    })
}
function addUser(req, res) {
  const email = req.body.email
  const gamename = req.body.gamename
  console.log(`app.post("/api/user",email:${email}`)
  knex('user')
  .insert({ email })
  .then(data => {
    knex('game')
    .insert({
      email,
      gamename
    })
    .returning('id')
    .on('query',(q)=>{
      console.log(q.sql)
    })
    .then(data=>{
      res.send(data)
    })
    .catch(err=> {
      console.log(`Error in addUser/insert game: ${err}`)
      res.sendStatus(500) 
    })
  })
  .catch(err => {
    console.log(`Error in adding user: ${err}`)
    res.sendStatus(500)
  })
}
function deleteUserWithEmail(req, res) {
  const email = req.params.email
  knex('user')
    .where({ email })
    .delete()
    .then(data => {
      res.sendStatus(200)
    })
    .catch(err => {
      res.sendStatus(500)
    })
}
module.exports = {
  getAll,
  getUserWithEmail,
  addUser,
  deleteUserWithEmail
}