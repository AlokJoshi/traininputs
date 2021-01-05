const express = require('express')
const { join } = require('path')
const app = express()
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000

let types = require('pg').types
types.setTypeParser(20, function (val) {
  return parseInt(val)
})

app.use(express.static('.'))
app.get("/auth_config.json", (req, res) => {
  res.sendFile(join(__dirname, "auth_config.json"))
})

const user = require('./routes/route_user')
const game = require('./routes/route_game')
const gameperiod = require('./routes/route_gameperiod')
const pathperiod = require('./routes/route_pathperiod')
const station = require('./routes/route_station')
const pathpoint = require('./routes/route_pathpoint')
const waypoint = require('./routes/route_waypoint')
const train = require('./routes/route_train')
const path = require('./routes/route_path')
const passenger = require('./routes/route_passenger')

//------------User-----------------

app.get("/api/user", user.getAll)
app.get("/api/user/email/:email", user.getUserWithEmail)
app.post("/api/user", user.addUser)
app.delete("/api/user/id/:id", user.deleteUserWithEmail)

//------------Game-----------------
app.get("/api/game", game.getAll)
app.get("/api/game/id/:id", game.getGameWithId)
app.get("/api/game/email/:email", game.getGameForUserGivenEmail)
app.post("/api/game", game.addGame)
app.delete("/api/game/id/:id", game.deleteGame)

//------------Gameperiod-----------------
app.get("/api/gameperiod/gameid/:gameid", gameperiod.getHighestPeriodGivenGameid)
app.post("/api/gameperiod", gameperiod.addGameperiod)

//------------Pathperiod-----------------
app.post("/api/pathperiod", pathperiod.addPathperiod)

//------------Station-----------------
app.get("/api/station/pathid/:pathid", station.getStationsGivenPathid)
app.post("/api/station", station.addStation)

//------------Pathpoint-----------------
app.get("/api/pathpoint/pathid/:pathid",pathpoint.getPathpointGivenPathid)
app.post("/api/pathpoint", pathpoint.addPathpoint)

//------------Waypoint-----------------
app.get("/api/waypoint/pathid/:pathid", waypoint.getWaypointGivenPathid)
app.post("/api/waypoint", waypoint.addWaypoint)

//------------Train-----------------
app.get("/api/train/pathid/:pathid", train.getTrainGivenPathid)
app.post("/api/train", train.addTrain)

//------------Path-----------------
app.get("/api/path/id/:id", path.getPath)
app.get("/api/path/gameperiodid/:gameperiodid", path.getPathsGivenGameperiodId)
app.post("/api/path", path.addPath)

//------------Passenger-----------------
app.get("/api/passenger/pathid/:pathid", passenger.getPassengersGivenPathid)
app.post("/api/passenger", passenger.addPassengers)


const server = app.listen(port, () => console.log(`Listening on port ${port}!`))