const MIN_ANGLE = 90
const FRAMES_PER_TIME_PERIOD = 100
const PASSENGER_COACH_CAPACITY = 10
const ROUTE_EDITING_STATE = 1
const STATION_EDITING_STATE = 2
const TRAIN_EDITING_STATE = 3
const RUNNING_STATE = 4
const PAUSED_STATE = 5

let state = PAUSED_STATE
let previous_state = PAUSED_STATE

let audiowhistle = document.createElement('audio')
audiowhistle.src = "steam engine whistle.mp3"
let audiochugging = document.createElement('audio')
audiochugging.src = "chugging sound.mp3"
let makeSound = false
let keyBufffer = new KeyBuffer()

let passengers = new Passengers()
let cities = new Cities()

updatePassengers(cities,passengers)

console.log(cities.city('Mumba'))
console.log(cities.city('abc'))
let travel_cost_per_unit_distance=1
let tickets = new Tickets(travel_cost_per_unit_distance)
let width=1920
let height=1080
let money = 10000000
let menu = false 
let stationEditMode = false
let animationMode = false 
let selectedPathNum = 1
let frames=0
















let i = 0;

const background = document.querySelector('#background')
const foreground = document.querySelector('#foreground')
const hudElement = document.querySelector('#hud')

background.width = 1920//window.innerWidth
background.height = 1080//window.innerHeight

foreground.width = 1920//window.innerWidth
foreground.height = 1080//window.innerHeight

hudElement.width = 1920//window.innerWidth
hudElement.height = 30 //window.innerHeight

const ctx_background = background.getContext('2d')
const ctx_foreground = foreground.getContext('2d')
const hud = new Hud(hudElement)



const img = new Image()
img.src = "aerialview2.png"
img.onload = function () {
  ctx_background.drawImage(img, 0, 0, background.width, background.height)
  cities.draw(ctx_background)
}

let done = false
const paths = new Paths()

let cashflow = new CashFlow(0,paths,0,0)

const MIN_LENGTH = 30
const LINE_WIDTH = 2

ctx_foreground.lineWidth = LINE_WIDTH
ctx_foreground.globalCompositeOperation = 'source-over'

let currentMousePosition = {
  x: 0,
  y: 0
}
let lastClick = {
  x: null,
  y: null
}
let currentPath = new Path(ctx_foreground)
paths.addPath(currentPath)
selectedPathNum = paths.numPaths

foreground.addEventListener('click', function (event) {
  if(state==ROUTE_EDITING_STATE){
    if (lastClick.x === null) {
      console.log(`last click was null. Adding the first point in the path`)
      currentPath.addPoint(new Point(event.offsetX, event.offsetY))
      lastClick.x = event.offsetX
      lastClick.y = event.offsetY
    } else if ((currentPath.length == 1) && (lineLength(lastClick.x, lastClick.y, event.offsetX, event.offsetY) > 2 * MIN_LENGTH)) {
      console.log(`adding the second point in the path`)
      currentPath.addPoint(new Point(event.offsetX, event.offsetY))
      lastClick.x = event.offsetX
      lastClick.y = event.offsetY
    } else if ((currentPath.length > 1) && (lineLength(lastClick.x, lastClick.y, event.offsetX, event.offsetY) > 2 * MIN_LENGTH)) {
      console.log(`Before checking if the between the lines is OK`)
      let lastTwoPoints = currentPath.lastTwoPoints
      //angle = angleBetweenLines(lastTwoPoints[0].x,lastTwoPoints[0].y,lastTwoPoints[1].x,lastTwoPoints[1].y,event.offsetX,event.offsetY)
      if (angleBetweenLinesIsOK(lastTwoPoints[0].x, lastTwoPoints[0].y, lastTwoPoints[1].x, lastTwoPoints[1].y, event.offsetX, event.offsetY)) {
        currentPath.addPoint(new Point(event.offsetX, event.offsetY))
        lastClick.x = event.offsetX
        lastClick.y = event.offsetY
        console.log(`adding 3rd or higher point in the path. In here we check if the angle between the lines is OK`)
      }
    }
  }
  if(state==STATION_EDITING_STATE){
    paths.addApproxStationLocation(selectedPathNum,event.offsetX,event.offsetY)
  }
  
})

function drawPaths() {
  ctx_foreground.clearRect(0, 0, foreground.width, foreground.height)
  paths.draw(state==ROUTE_EDITING_STATE)
}

document.onmousemove = function (event) {
  currentMousePosition.x = event.offsetX
  currentMousePosition.y = event.offsetY
  if(lastClick.x){
    drawPaths()
    ctx_foreground.beginPath()
    ctx_foreground.moveTo(lastClick.x,lastClick.y)
    ctx_foreground.lineTo(currentMousePosition.x,currentMousePosition.y)
    ctx_foreground.stroke()
  }
}

document.onkeypress = function (event) {
  if(canvases.style.visibility=='collapse') return

  keyBufffer.addKey(event.key)
  updateHUD()
  if (state==ROUTE_EDITING_STATE && event.key == 'f') {
    console.log(currentPath)
    lastClick.x = null
    lastClick.y = null
    money-=currentPath.pathCapitalCost
    // updateRailwayTracksSelectBox(paths)
    currentPath.finalized=true
    currentPath.createWayPoints()
    currentPath.updateStations()
  } else if (state==ROUTE_EDITING_STATE && event.key == 'd') {
    if(!currentPath.finalized){
      currentPath.popPoint()
      if (currentPath.length == 0) {
        lastClick.x = null
        lastClick.y = null
      }
    }
  // } else if (event.key == 's'){
  //   stationEditMode = !stationEditMode
  //   ctx_strokeStyle = 'black'
  //   updateHUD()
  } else if (state==ROUTE_EDITING_STATE && event.key == 'a') {
    if(!currentPath.finalized){
      lastClick.x = null
      lastClick.y = null
      money-=currentPath.pathCapitalCost
      //updateRailwayTracksSelectBox(paths)
      currentPath.finalized=true  
    }
    currentPath = new Path(ctx_foreground)
    paths.addPath(currentPath)
  } else if (event.key == ' ') {
    selectedPathNum++
    if (selectedPathNum > paths.numPaths) selectedPathNum = 1
    console.log(`selectedPathNum:${selectedPathNum}`)
  } else if (state==RUNNING_STATE) {
    if(paths.atLeastOnePathFinalized){
      animationMode=true 
      i = 0;
      paths.createWayPoints()
      paths.updateStations()
      paths.drawBackground(ctx_background)
      paths.drawStations(ctx_background)
      //cities.draw(ctx_background)
      paths.paths.forEach(p=>{
        console.log(p.pathCapitalCost)
      })
      if(makeSound) audiochugging.play()
      if(frames==0){
        //this starts up the animation when the game is
        //just starting
        animate();
      }
    }else{
      console.log(`No path finalized yet`)
    }
  }else if (state==PAUSED_STATE) {
    return
  }else if(event.key == 'm'){
    displayPassengersTable(passengers.passengers)
    displayTicketPricesTable(tickets.tickets)
    document.getElementById('menu').style.zIndex=!menu?'100':'0'
    menu=!menu
    console.log(`zIndex: foreground(${foreground.style.zIndex}) background(${background.style.zIndex} gui(${document.getElementById('menu').style.zIndex})`)
  }else if(event.key == 'rightArrow'){
    //window.scrollBy(10)
  }else if(event.key == 'leftArrow'){
    //window.scrollBy(-10)
  }
  ctx_foreground.clearRect(0, 0, foreground.width, foreground.height)
  paths.draw(state==ROUTE_EDITING_STATE)
};


ctx_foreground.font = "20px Comic Sans MS";
ctx_foreground.fillStyle = "black";

const animate = (ts) => {
  if(state==RUNNING_STATE){
    ctx_foreground.clearRect(0, 0, foreground.width, foreground.height)
    paths.animate(background, ctx_foreground)
    frames++
    if(frames%10000==0 && frames>0) updatePassengers(cities,passengers)
    if(frames%10000==0 && frames>0) updateMoney()
  }
  let txt = ''
  txt+=`Elapsed Time: ${Math.floor(frames/FRAMES_PER_TIME_PERIOD)} Money: ${money} ${state==PAUSED_STATE?'Paused':''} Menu: ${menu}`
  ctx_foreground.fillText(txt, 10, background.height - 10,1000);
  // for (let i = 0; i < currentPath.quadraticSegments.length; i++) {
  //   seg = currentPath.quadraticSegments[i]
  //   txt1 += `(${Math.floor(seg.p1.x)},${Math.floor(seg.p1.y)}),(${Math.floor(seg.p2.x)},${Math.floor(seg.p2.y)}),(${Math.floor(seg.cp.x)},${Math.floor(seg.cp.y)})`
  // }
  // for (let i = 0; i < currentPath.lineSegments.length; i++) {
  //   seg = currentPath.lineSegments[i]
  //   txt2 += `(${Math.floor(seg.p1.x)},${Math.floor(seg.p1.y)}),(${Math.floor(seg.p2.x)},${Math.floor(seg.p2.y)})`
  // }
  // ctx_foreground.fillText(`Quad Seg : ${txt1}`, 10, background.height - 50);
  // ctx_foreground.fillText(`Lin Seg : ${txt2}`, 10, background.height - 30);
  // ctx_foreground.fillText(`FrameRate:${frame_rate}`,10,background.height - 10)
  setTimeout(()=>{
    if(state==RUNNING_STATE){
      request = requestAnimationFrame(animate)
    }
  },150)
}


let game = new Game()
game.init()
console.log(game.MIN_ANGLE)






