//const { response } = require("express")

async function getUser(email) {
  const response = await fetch(`/api/user/email/${email}`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'GET'
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  const users = await response.json()
  return users[0]
}

function userExists(email) {
  return !!getUser(email)
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

async function createNewGame(email, gamename) {
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
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  let games = await response.json()
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

async function saveTrainToDB(pathid, passengercoaches, goodscoaches) {
  if(!pathid){
    console.log(`%cTrain info not saved to DB since the pathid was null`,`color:red`)
    return
  }
  let data = {
    pathid: pathid,
    passengercoaches: passengercoaches,
    goodscoaches: goodscoaches
  }
  const response = await fetch(`/api/train`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'POST',
    body: Qs.stringify(data)
  })
  if(!response.ok){
    throw new Error("Network response was not ok")
  }
  return response.json()
}
/* 
async function savePassengersOnTrainToDB(pathperiodid, passengers) {
  if(!Object.hasOwnProperty(passengers)){
    console.log(`%cPassengers Object is empty and hence not saved`,'color:red')
    return
  }
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
 */
/* 
async function savePeriodPathToDB(gameperiodid, pathid, i, numframes,going, passengercoaches, goodscoaches, passengers) {
  let data = {
    gameperiodid: gameperiodid,
    pathid: pathid,
    i: i,
    numframes: numframes,
    going: going,
    passengercoaches: passengercoaches,
    goodscoaches: goodscoaches,
    passengers: passengers
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
 */
async function getGamePeriodId(gameid, period, passengerid, openingcash, openingcumcapitalcost, openingcumdepreciation, cumtrackcost, cumstationcost,
                               costs, sales, interest, tax, profit,cumcoachcost,cumenginecost) {
  let data = {
    gameid: gameid,
    period: period,
    passengerid: passengerid,
    openingcash: Math.round(openingcash),
    openingcumcapitalcost: Math.round(openingcumcapitalcost),
    openingcumdepreciation: Math.round(openingcumdepreciation),
    cumtrackcost: Math.round(cumtrackcost),
    cumstationcost: Math.round(cumstationcost),
    costs: Math.round(costs),
    sales: Math.round(sales),
    interest: Math.round(interest),
    tax: Math.round(tax),
    profit: Math.round(profit),
    cumcoachcost: Math.round(cumcoachcost),
    cumenginecost: Math.round(cumenginecost)
  }
  const response = await fetch(`/api/gameperiod`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'POST',
    body: Qs.stringify(data)
  })
  if(!response.ok){
    throw new Error("Network response was not ok")
  }
  const json = await response.json()
  return json
}
async function savePathToDB(gameid, routenumber, finalized, points, wparray, starray) {
  wparray.forEach(element => {
    element.x = Math.round(element.x*1000)/1000
    element.y = Math.round(element.y*1000)/1000
  });
  let data = {
    gameid: gameid,
    routenumber: routenumber,
    finalized: finalized,
    points: points,
    wparray: wparray,
    starray: starray
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
async function updatePathInDB(pathid, gameperiodid,  i, numframes,going, passengercoaches, goodscoaches, passengers) {
  let data = {
    pathid:pathid,
    gameperiodid: gameperiodid,
    i: i,
    numframes:numframes,
    going:going,
    passengercoaches: passengercoaches,
    goodscoaches: goodscoaches,
    passengers:passengers
  }
  const response = await fetch(`/api/path`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'PUT',
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

async function deleteUser(email){
  
  const response = await fetch(`/api/user/email/${email}`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'DELETE'
  })
  if(!response.ok){
    throw new Error("Network response was not ok")
  }
  return true

}

async function getGamePeriodData(gameid) {
  const response = await fetch(`/api/gameperiod/${gameid}`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'GET'
  })
  if(!response.ok){
    throw new Error("Network response was not ok")
  }
  let json = await response.json()
  //console.log(`getGamePeriodData should return some data:`)
  //console.log(json)
  return json
}

async function getPathData(gameid) {
  const response = await fetch(`/api/path/gameid/${gameid}`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'GET'
  })
  if(!response.ok){
    throw new Error("Network response was not ok")
  }
  let json = await response.json()
  //console.log(`getPathData should return some data:`)
  //console.log(json)
  return json
}

async function getWaypointData(pathid) {
  const response = await fetch(`/api/waypoint/pathid/${pathid}`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'GET'
  })
  if(!response.ok){
    throw new Error("Network response was not ok")
  }
  let json = await response.json()
  //console.log(`getWaypointData should return some data:`)
  //console.log(json)
  return json
}
async function saveStationToDB(pathid, name, wpn, x, y) {
  if(!pathid){
    console.log(`%cStation info not saved to DB since the pathid was null`,`color:red`)
    return
  }
  let data = {
    pathid: pathid,
    name: name,
    wpn: wpn,
    x: x,
    y: y
  }
  const response = await fetch(`/api/station`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'POST',
    body: Qs.stringify(data)
  })
  if(!response.ok){
    throw new Error("Network response was not ok")
  }
  return response.json()
}
async function getStations(pathid) {
  const response = await fetch(`/api/station/pathid/${pathid}`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'GET'
  })
  if(!response.ok){
    throw new Error("Network response was not ok")
  }
  let json = await response.json()
  //console.log(`getStations should return some data:`)
  //console.log(json)
  return json
}

async function saveUpdatedTrainInfoToDB(pathid,passengercoaches,goodscoaches) {
  if(!pathid){
    console.log(`In saveUpdatedTrainInfoToDB pathid: ${pathid}`)
    return
  }
  let data = {
    pathid: pathid,
    passengercoaches: passengercoaches,
    goodscoaches: goodscoaches
  }
  
  const response = await fetch(`/api/train`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'POST',
    body: Qs.stringify(data)
  })
  if(!response.ok){
    throw new Error("Network response was not ok")
  }
  let json = await response.json()
  //console.log(json)
  return json
}

async function updateGameNameInDB(id,name) {
  if(!id){
    console.log(`In updateGameNameInDB id: ${id}`)
    return
  }
  let data = {
    id: id,
    name: name
  }
  const response = await fetch(`/api/game`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'PUT',
    body: Qs.stringify(data)
  })
  if(!response.ok){
    throw new Error("Network response was not ok in updateGameNameInDB")
  }
}

async function getLeaderboard(periodlist) {
  const response = await fetch(`/api/leaderboard/periods/${periodlist}`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    method: 'GET'
  })
  if(!response.ok){
    throw new Error("Network response was not ok")
  }
  let json = await response.json()
  //console.log(`getLeaderboard should return some data:`)
  //console.log(JSON.stringify(json))
  return json.rows
}