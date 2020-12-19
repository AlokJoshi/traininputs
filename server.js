const express = require('express')
const { join } = require('path')
const app = express()
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000

let types = require('pg').types
types.setTypeParser(20, function (val) {
  return parseInt(val)
})
require('dotenv').config()
let knex = require('knex')({
  client: 'pg',
  version: '9.6',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    //ssl:true
  },
  //debug:true
});

knex.raw("SELECT 1;").then(() => {
  console.log(`Success in connecting to the database`)
}).catch((err) => {
  console.log(`Error in connecting to the database: ${err}`)
  process.exit()
})

app.use(express.static('.'))
app.get("/auth_config.json", (req, res) => {
  res.sendFile(join(__dirname, "auth_config.json"))
})


app.get("/api/users", (req, res) => {
  knex('user')
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.sendStatus(500)
    })
})
app.get("/api/user/id/:id", (req, res) => {
  const id = req.params.id
  knex('user')
    .where('id', id)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.sendStatus(500)
    })
})
app.get("/api/user/email/:email", (req, res) => {
  const email = req.params.email
  knex('user')
    .where('email', email)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.sendStatus(500)
    })
})
app.post("/api/user", (req, res) => {
  const email = req.body.email
  console.log(`app.post("/api/user",email:${email}`)
  knex('user')
    .insert({ email })
    .returning('id')
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.sendStatus(500)
    })
})
app.delete("/api/user/id/:id", (req, res) => {
  const id = req.params.id
  knex('user')
    .where({ id })
    .delete()
    .then(data => {
      res.sendStatus(200)
    })
    .catch(err => {
      res.sendStatus(500)
    })
})
//------------Game-----------------
app.get("/api/games", (req, res) => {
  knex('game')
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.sendStatus(500)
    })
})
app.get("/api/game/id/:id", (req, res) => {
  const id = req.params.id
  knex('game')
    .where('id', id)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.sendStatus(500)
    })
})
app.get("/api/games/userid/:userid", (req, res) => {
  const userid = req.params.userid
  console.log(`app.get("/api/games/userid/:userid", userid:${userid}`)
  knex('game')
    .where('userid', userid)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.sendStatus(500)
    })
})
app.get("/api/games/email/:email", (req, res) => {
  const email = req.params.email
  console.log(`app.get("/api/games/email/:email", email:${email}`)
  knex('game')
    .innerJoin('user', { 'game.userid': 'user.id' })
    .where('user.email', email)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.sendStatus(500)
    })
})
app.post("/api/game", (req, res) => {
  const userid = req.body.userid
  const gamename = req.body.gamename
  console.log(`app.post("/api/user",email:${userid},${gamename}`)
  knex('game')
    .insert({ userid, gamename })
    .returning('id')
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.sendStatus(500)
    })
})
app.delete("/api/game/id/:id", (req, res) => {
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
})
//------------Station-----------------
app.get("/api/stations/pathid/:pathid", (req, res) => {
  const pathid = req.params.pathid
  knex('station')
    .where('pathid', pathid)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.sendStatus(500)
    })
})
app.post("/api/station", (req, res) => {
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
      res.sendStatus(500)
    })
})
//------------Pathpoint-----------------
app.get("/api/pathpoints/pathid/:pathid", (req, res) => {
  const pathid = req.params.pathid
  knex('pathpoint')
    .where('pathid', pathid)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.sendStatus(500)
    })
})
app.post("/api/pathpoint", (req, res) => {
  const pathid = req.body.pathid
  const x = req.body.x
  const y = req.body.y
  console.log(`app.post("/api/pathpoint",pathid:${pathid},${x},${y}`)
  knex('pathpoint')
    .insert({ pathid, x, y })
    .returning('id')
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.sendStatus(500)
    })
})
//------------Waypoint-----------------
app.get("/api/waypoints/pathid/:pathid", (req, res) => {
  const pathid = req.params.pathid
  knex('waypoint')
    .where('pathid', pathid)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.sendStatus(500)
    })
})
app.post("/api/waypoint", (req, res) => {
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
})
const server = app.listen(port, () => console.log(`Listening on port ${port}!`))