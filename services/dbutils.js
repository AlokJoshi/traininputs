//const { response } = require("express")

async function getUser(email) {
  const response = await fetch(`/api/user/email/${email}`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'GET'
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  const user = await response.json()
  return user[0]
}
function userExists(email) {
  return getUser(email)!=undefined
}
async function createUserAndDefaultGame(email, gamename) {
  let newGameId
  const data = { email, gamename }
  const response = await fetch('/api/user', {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'POST',
    body: Qs.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  newGameId = await response.json()
  return newGameId[0]
}

async function getAllGamesForEmail(email) {
  const response = await fetch(`/api/game/email/${email}`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'GET'
  })
  if (response.ok) {
    throw new Error('Network response was not ok')
  }
  let games = response.json()
  return games
}
async function addGameForEmail(email, gamename) {
  let data = {
    email: email,
    gamename: gamename
  }
  const response = await fetch(`/api/game`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'POST',
    body: Qs.stringify(data)
  })
  if(!response.ok){
    throw new Error("Network response was not ok")
  }
  return response.json()
}

async function saveTrainToDB(pathid, period, num_passenger_coaches, num_goods_coaches) {
  let data = {
    pathid: pathid,
    period: period,
    gamename: gamename
  }
  const response = await fetch(`/api/game`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'POST',
    body: Qs.stringify(data)
  })
  if(!response.ok){
    throw new Error("Network response was not ok")
  }
  return response.json()
}
async function savePassengersOnTrainToDB(pathperiodid, passengers) {
  let data = {
    pathperiodid: pathperiodid,
    passengers: passengers
  }
  console.log(Qs.stringify(data))
  const response = await fetch(`/api/passenger`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'POST',
    body: Qs.stringify(data)
  })
  if(!response.ok){
    throw new Error("Network response was not ok")
  }
  let obj = await response.json()
  return obj[0]
}
async function savePeriodPathToDB(gameperiodid, pathid, i, numframes,going, passengercoaches, goodscoaches) {
  let data = {
    gameperiodid: gameperiodid,
    pathid: pathid,
    i: i,
    numframes: numframes,
    going: going,
    passengercoaches: passengercoaches,
    goodscoaches: goodscoaches
  }
  const response = await fetch(`/api/pathperiod`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'POST',
    body: Qs.stringify(data)
  })
  if(!response.ok){
    throw new Error("Network response was not ok")
  }
  let json = await response.json()
  return json
}
async function getGamePeriodId(gameid, period, passengerid, openingcash, openingcumcapitalcost, openingcumdepreciation, cumtrackcost, cumstationcost) {
  let data = {
    gameid: gameid,
    period: period,
    passengerid: passengerid,
    openingcash: openingcash,
    openingcumcapitalcost: openingcumcapitalcost,
    openingcumdepreciation: openingcumdepreciation,
    cumtrackcost: cumtrackcost,
    cumstationcost: cumstationcost,
  }
  const response = await fetch(`/api/gameperiod`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'POST',
    body: Qs.stringify(data)
  })
  if(!response.ok){
    throw new Error("Network response was not ok")
  }
  const json = response.json()
  return json
}
async function savePathToDB(gameid, routenumber, finalized, points) {
  let data = {
    gameid: gameid,
    routenumber: routenumber,
    finalized: finalized,
    points: points
  }
  const response = await fetch(`/api/path`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'POST',
    body: Qs.stringify(data)
  })
  if(!response.ok){
    throw new Error("Network response was not ok")
  }
  let json = await response.json()
  return json
}
async function saveWayPointToDB(pathid,n,x,y,feature){
  let data = {
    pathid: pathid,
    n: n,
    x: x,
    y: y,
    feature: feature
  }
  const response = await fetch(`/api/waypoint`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'POST',
    body: Qs.stringify(data)
  })
  if(!response.ok){
    throw new Error("Network response was not ok")
  }
  let json = await response.json()
  return json

}