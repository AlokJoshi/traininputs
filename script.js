const MIN_ANGLE = 90
const FRAMES_PER_TIME_PERIOD = 100
const PASSENGER_COACH_CAPACITY = 10
const D = 2

let audiowhistle = document.createElement('audio')
audiowhistle.src = "steam engine whistle.mp3"
let audiochugging = document.createElement('audio')
audiochugging.src = "chugging sound.mp3"
let makeSound = false

let passengers = new Passengers()
let cities = new Cities()

updatePassengers(cities,passengers)

let train = new Train(3,0,0)
console.log(train.capitalCost)
console.log(train.runningCostPerTimePeriod)
train.addPassengerCoach()
console.log(train.capitalCost)
console.log(train.runningCostPerTimePeriod)

console.log(cities.city('Mumba'))
console.log(cities.city('abc'))
let travel_cost_per_unit_distance=1
let tickets = new Tickets(travel_cost_per_unit_distance)
let width=1920
let height=1080
let money = 10000000
let menu = false 
let last_ts=0
let pathEditMode = false
let selectedPathNum = 1
let frames=0
let paused = false
let i = 0;

const background = document.querySelector('#background')
const foreground = document.querySelector('#foreground')
const gui = document.querySelector('#gui')

background.width = 1920//window.innerWidth
background.height = 1080//window.innerHeight

foreground.width = 1920//window.innerWidth
foreground.height = 1080//window.innerHeight

gui.width = 1920//window.innerWidth
gui.height = 1080//window.innerHeight

const ctx_background = background.getContext('2d')
const ctx_foreground = foreground.getContext('2d')
const ctx_gui = gui.getContext('2d')

console.log(ctx_background)

const img = new Image()
img.src = "aerialview2.png"
img.onload = function () {
  ctx_background.drawImage(img, 0, 0, background.width, background.height)
  cities.draw(ctx_background)
}

const img_coach = new Image()
img_coach.src = "coach.png"
img_coach.onload = function () {
  ctx_gui.drawImage(img_coach, gui.width-100, 10, img_coach.width,img_coach.height)
}
gui.onclick = function(event) {
  alert('clicked on gui')
}

const img_plus = new Image()
img_plus.src = "plus.png"
img_plus.onload = function () {
  ctx_gui.drawImage(img_plus, gui.width-70, 10, img_plus.width,img_plus.height)
}

const img_negative = new Image()
img_negative.src = "negative.png"
img_negative.onload = function () {
  ctx_gui.drawImage(img_negative, gui.width-40, 10, img_negative.width,img_negative.height)
}

let done = false
const paths = new Paths()
updateMoney()

const MIN_LENGTH = 50
const LINE_WIDTH = 0.1

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

//ctx_background.clearRect(0, 0, background.width, background.height)
foreground.addEventListener('click', function (event) {
  if(currentPath.finalized && !event.shiftKey){
    //nothing happens if the path has been finalized
    return
  }
  if (event.shiftKey) {
    paths.addApproxStationLocation(selectedPathNum,event.offsetX,event.offsetY)
    //paths.addStation(selectedPathNum,event.offsetX,event.offsetY)
  } else {
    if (lastClick.x === null) {
      //console.log(`if(lastClick.x===null){`)
      currentPath.addPoint(new Point(event.offsetX, event.offsetY))
      lastClick.x = event.offsetX
      lastClick.y = event.offsetY
    } else if ((currentPath.length == 1) && (lineLength(lastClick.x, lastClick.y, event.offsetX, event.offsetY) > 2 * MIN_LENGTH)) {
      //console.log(`if((currentPath.length==1) && (lineLength(lastClick.x,lastClick.y,event.offsetX,event.offsetY)>2*MIN_LENGTH)){`)
      currentPath.addPoint(new Point(event.offsetX, event.offsetY))
      lastClick.x = event.offsetX
      lastClick.y = event.offsetY
    } else if ((currentPath.length > 1) && (lineLength(lastClick.x, lastClick.y, event.offsetX, event.offsetY) > 2 * MIN_LENGTH)) {
      //console.log(`if((currentPath.length>1) && (lineLength(lastClick.x,lastClick.y,event.offsetX,event.offsetY)>2*MIN_LENGTH)){`)
      let lastTwoPoints = currentPath.lastTwoPoints
      //angle = angleBetweenLines(lastTwoPoints[0].x,lastTwoPoints[0].y,lastTwoPoints[1].x,lastTwoPoints[1].y,event.offsetX,event.offsetY)
      if (angleBetweenLinesIsOK(lastTwoPoints[0].x, lastTwoPoints[0].y, lastTwoPoints[1].x, lastTwoPoints[1].y, event.offsetX, event.offsetY)) {
        currentPath.addPoint(new Point(event.offsetX, event.offsetY))
        lastClick.x = event.offsetX
        lastClick.y = event.offsetY
      }
      /* angle = angleBetweenLines(lastTwoPoints[0].x,lastTwoPoints[0].y,lastTwoPoints[1].x,lastTwoPoints[1].y,event.offsetX,event.offsetY)
      if(angle>=MIN_ANGLE){
          currentPath.addPoint(new Point(event.offsetX,event.offsetY))
          lastClick.x = event.offsetX
          lastClick.y = event.offsetY
      } */
    }
  }
  drawPaths()
})

function drawPaths() {
  ctx_foreground.clearRect(0, 0, foreground.width, foreground.height)
  paths.draw(pathEditMode, selectedPathNum)
}

document.onmousemove = function (event) {
  currentMousePosition.x = event.offsetX
  currentMousePosition.y = event.offsetY
  if(lastClick.x){
    ctx_foreground.clearRect(0,0,foreground.width,foreground.height)
    ctx_foreground.beginPath()
    ctx_foreground.moveTo(lastClick.x,lastClick.y)
    ctx_foreground.lineTo(currentMousePosition.x,currentMousePosition.y)
    ctx_foreground.stroke()
  }
}

document.onkeypress = function (event) {

  if (event.key == 'f') {
    console.log(currentPath)
    lastClick.x = null
    lastClick.y = null
    money-=currentPath.pathCapitalCost
    updateRailwayTracksSelectBox(paths)
    currentPath.finalized=true
  } else if (event.key == 'd') {
    currentPath.popPoint()
    if (currentPath.length == 0) {
      lastClick.x = null
      lastClick.y = null
    }
  } else if (event.key == 's') {
    currentPath = new Path(ctx_foreground)
    paths.addPath(currentPath)
    lastClick.x = null
    lastClick.y = null
  } else if (event.key == ' ') {
    selectedPathNum++
    if (selectedPathNum > paths.numPaths) selectedPathNum = 1
    console.log(`selectedPathNum:${selectedPathNum}`)
  } else if (event.key == 't') {
    pathEditMode = !pathEditMode
    console.log(`pathEditMode:${pathEditMode}`)
  } else if (event.key == 'x') {
    i = 0;
    //foreground.getContext('2d').drawImage(background,0,0,background.width,background.height)
    paths.updateNeighbors()
    paths.updateStations()
    paths.drawBackground(ctx_background)
    paths.drawStations(ctx_background)
    //cities.draw(ctx_background)
    paths.paths.forEach(p=>{
      console.log(p.pathCapitalCost)
    })
    if(makeSound) audiochugging.play()
    performAnimation();
  }else if (event.key == 'p') {
    paused=!paused
    return
  }else if(event.key == 'm'){
    displayPassengersTable(passengers.passengers)
    displayTicketPricesTable(tickets.tickets)
    document.getElementById('menu').style.zIndex=!menu?'100':'0'
    menu=!menu
    console.log(`zIndex: foreground(${foreground.style.zIndex}) background(${background.style.zIndex} gui(${document.getElementById('menu').style.zIndex})`)
  // }else if(event.key == 'rightArrow'){
  //   window.scrollBy(10)
  }
  ctx_foreground.clearRect(0, 0, foreground.width, foreground.height)
  paths.draw(pathEditMode, selectedPathNum)
};


ctx_foreground.font = "20px Comic Sans MS";
ctx_foreground.fillStyle = "black";
const performAnimation = (ts) => {
  // let frame_rate = Math.round(1000/(ts-last_ts),1)
  // last_ts=ts
  if(!paused){
    ctx_foreground.clearRect(0, 0, foreground.width, foreground.height)
    paths.animate(background, ctx_foreground)
    frames++
    if(frames%10000==0 && frames>0) updatePassengers(cities,passengers)
    if(frames%10000==0 && frames>0) updateMoney()
  }
  let txt = ''
  txt+=`Elapsed Time: ${Math.floor(frames/FRAMES_PER_TIME_PERIOD)} Money: ${money} ${paused?'Paused':''} Menu: ${menu}`
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
    request = requestAnimationFrame(performAnimation)
  },50)
}










