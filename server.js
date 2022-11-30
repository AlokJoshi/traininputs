const { Server } = require("socket.io")
const Filter = require("bad-words")
const filter = new Filter()
const express = require('express')
const { join } = require('path')
const app = express()
app.use(express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 1000000}));
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
const leaderboard = require('./routes/route_leaderboard')
const station = require('./routes/route_station')
const pathpoint = require('./routes/route_pathpoint')
//const waypoint = require('./routes/route_waypoint')
const train = require('./routes/route_train')
const path = require('./routes/route_path')
//const passenger = require('./routes/route_passenger')

//------------User-----------------

app.get("/api/user", user.getAll)
app.get("/api/user/email/:email", user.getUserWithEmail)
app.post("/api/user", user.addUser)
app.delete("/api/user/email/:email", user.deleteUserWithEmail)

//------------Game-----------------
app.get("/api/game", game.getAll)
app.get("/api/game/id/:id", game.getGameWithId)
app.get("/api/game/email/:email", game.getGameForUserGivenEmail)
app.post("/api/game", game.addGame)
app.put('/api/game', game.updateName)
app.delete("/api/game/id/:id", game.deleteGame)

//------------Gameperiod-----------------
app.get("/api/gameperiod/gameid/:gameid", gameperiod.getHighestPeriodGivenGameid)
app.get("/api/gameperiod/:gameid", gameperiod.getGamePeriodDataGivenGameid)
app.post("/api/gameperiod", gameperiod.addGameperiod)

//------------Station-----------------
app.get("/api/station/pathid/:pathid", station.getStationsGivenPathid)
app.post("/api/station", station.addStation)

//------------Pathpoint-----------------
app.get("/api/pathpoint/pathid/:pathid",pathpoint.getPathpointGivenPathid)
app.post("/api/pathpoint", pathpoint.addPathpoint)

//------------Waypoint-----------------
// app.get("/api/waypoint/pathid/:pathid", waypoint.getWaypointGivenPathid)
// app.post("/api/waypoint", waypoint.addWaypoint)

//------------Train-----------------
app.get("/api/train/pathid/:pathid", train.getTrainGivenPathid)
app.post("/api/train", train.updateTrainInfo)

//------------Path-----------------
app.get("/api/path/id/:id", path.getPath)
app.get("/api/path/gameid/:gameid", path.getPathsGivenGameId)
app.post("/api/path", path.addPath)
app.put("/api/path", path.updatePath)

//------------Leaderboard-----------------
app.get("/api/leaderboard/email/:email/periods/:periods",leaderboard.getleaderboard)

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}!`)
  //test if filter.clean is working..
  //console.log(filter.clean("Don't be an ash0le"))
})

const io = new Server(server);
io.on('connection', (socket) => {
  //console.log(`a user connected with a socket.id of ${socket.id}`);
  socket.on('chat',function(msg){
    //console.log(`message received from: ${msg.email}, message:${filter.clean(msg.message)}`)
    //this emits the message to all connected clients
    //AJ: Commented out the following line
    // msg.message = filter.clean(msg.message)
    io.emit('chat',msg)
  })
  socket.on('milestone',function(msg){
    //console.log(`milestone received from: ${msg.email}, message:${filter.clean(msg.milestone)}`)
    //this emits the message to all connected clients
    //AJ: Commented out the following line
    // msg.milestone = filter.clean(msg.milestone)
    io.emit('milestone',msg)
  })
});
