class Game {
  static PASSENGER_COACH_CAPACITY=20
  static MIN_LENGTH = 30
  static LINE_WIDTH = 2
  static OPENING_CASH = 10000000
  static FRAMES_PER_TIME_PERIOD = 100
  static PERIODS_PER_MEGA_PERIOD = 100

  period = 0
  megaperiod = 0
  MIN_ANGLE = 90
  ROUTE_EDITING_STATE = 1
  STATION_EDITING_STATE = 2
  TRAIN_EDITING_STATE = 3
  RUNNING_STATE = 4
  PAUSED_STATE = 5
  travel_cost_per_unit_distance = 1
  makeSound = false

  state = this.PAUSED_STATE
  previous_state = this.PAUSED_STATE
  width = 1920
  height = 1080
  menu = false
  stationEditMode = false
  animationMode = false
  selectedPathNum = 1
  frames = 0
  i = 0;


  currentMousePosition = {
    x: 0,
    y: 0
  }
  lastClick = {
    x: null,
    y: null
  }

  constructor() {
    this.request = null
    this.canvases = document.getElementById('canvases')
    this.audiowhistle = document.createElement('audio')
    this.audiowhistle.src = "steam engine whistle.mp3"
    this.audiochugging = document.createElement('audio')
    this.audiochugging.src = "chugging sound.mp3"
    this.keyBufffer = new KeyBuffer(this)
    this.passengers = new Passengers()
    this.cities = new Cities()
    updatePassengers(this.period, this.cities, this.passengers)
    console.log(this.cities.city('Mumba'))
    console.log(this.cities.city('abc'))
    this.tickets = new Tickets(this.travel_cost_per_unit_distance)

    this.background = document.querySelector('#background')
    this.foreground = document.querySelector('#foreground')
    this.hudElement = document.querySelector('#hud')

    this.background.width = 1920//window.innerWidth
    this.background.height = 1080//window.innerHeight

    this.foreground.width = 1920//window.innerWidth
    this.foreground.height = 1080//window.innerHeight

    this.hudElement.width = 1920//window.innerWidth
    this.hudElement.height = 30 //window.innerHeight

    this.ctx_background = this.background.getContext('2d')
    this.ctx_foreground = this.foreground.getContext('2d')
    this.hud = new Hud(this.hudElement)

    this.img = new Image()
    this.img.src = "aerialview2.png"
    this.img.onload = () => {
      this.ctx_background.drawImage(this.img, 0, 0, this.background.width, this.background.height)
      this.cities.draw(this.ctx_background)
    }

    this.paths = new Paths(this)
    this.cashflow = new CashFlow(this,Game.OPENING_CASH,0,0)

    this.ctx_foreground.lineWidth = Game.LINE_WIDTH
    this.ctx_foreground.globalCompositeOperation = 'source-over'

    this.currentPath = new Path(this,this.ctx_foreground)
    this.paths.addPath(this.currentPath)
    this.selectedPathNum = this.paths.numPaths

    this.ctx_foreground.font = "20px Comic Sans MS";
    this.ctx_foreground.fillStyle = "black";

    this.addEventListeners()
    this.addMouseListener()
    this.addKeyEventListener()
  }

  addEventListeners() {
    this.foreground.addEventListener('click', (event)=> {
      if (this.state == this.ROUTE_EDITING_STATE) {
        console.log(`this.currentPath.length == 1:${this.currentPath.length == 1}`)
        console.log(`(lineLength(this.lastClick.x, this.lastClick.y, event.offsetX, event.offsetY) > 2 * Game.MIN_LENGTH) ${lineLength(this.lastClick.x, this.lastClick.y, event.offsetX, event.offsetY) > 2 * Game.MIN_LENGTH}`)
        if (this.lastClick.x === null) {
          console.log(`last click was null. Adding the first point in the path`)
          this.currentPath.addPoint(new Point(event.offsetX, event.offsetY))
          this.lastClick.x = event.offsetX
          this.lastClick.y = event.offsetY
        } else if ((this.currentPath.length == 1) && (lineLength(this.lastClick.x, this.lastClick.y, event.offsetX, event.offsetY) > 2 * Game.MIN_LENGTH)) {
          console.log(`adding the second point in the path`)
          this.currentPath.addPoint(new Point(event.offsetX, event.offsetY))
          this.lastClick.x = event.offsetX
          this.lastClick.y = event.offsetY
        } else if ((this.currentPath.length > 1) && (lineLength(this.lastClick.x, this.lastClick.y, event.offsetX, event.offsetY) > 2 * Game.MIN_LENGTH)) {
          console.log(`Before checking if the between the lines is OK`)
          let lastTwoPoints = this.currentPath.lastTwoPoints
          //angle = angleBetweenLines(lastTwoPoints[0].x,lastTwoPoints[0].y,lastTwoPoints[1].x,lastTwoPoints[1].y,event.offsetX,event.offsetY)
          if (angleBetweenLinesIsOK(lastTwoPoints[0].x, lastTwoPoints[0].y, lastTwoPoints[1].x, lastTwoPoints[1].y, event.offsetX, event.offsetY,this.MIN_ANGLE)) {
            this.currentPath.addPoint(new Point(event.offsetX, event.offsetY))
            this.lastClick.x = event.offsetX
            this.lastClick.y = event.offsetY
            console.log(`adding 3rd or higher point in the path. In here we check if the angle between the lines is OK`)
          }
        }
      }
      if (this.state == this.STATION_EDITING_STATE) {
        this.paths.addApproxStationLocation(this.selectedPathNum, event.offsetX, event.offsetY)
      }
    })
  }

  drawPaths() {
    this.ctx_foreground.clearRect(0, 0, this.foreground.width, this.foreground.height)
    this.paths.draw()
  }

  addMouseListener() {
    document.onmousemove = (event) => {
      this.currentMousePosition.x = event.offsetX
      this.currentMousePosition.y = event.offsetY
      if (this.lastClick.x) {
        this.drawPaths()
        this.ctx_foreground.beginPath()
        this.ctx_foreground.moveTo(this.lastClick.x, this.lastClick.y)
        this.ctx_foreground.lineTo(this.currentMousePosition.x, this.currentMousePosition.y)
        this.ctx_foreground.stroke()
      }
    }
  }

  addKeyEventListener() {
    document.onkeypress = (event) => {
      if (this.canvases.style.visibility == 'collapse') return

      this.keyBufffer.addKey(event.key)
      this.updateHUD()
      if (this.state == this.ROUTE_EDITING_STATE && event.key == 'f') {
        console.log(`iNSIDE F : ${this.currentPath}`)
        this.lastClick.x = null
        this.lastClick.y = null
        this.cashflow.trackcost = this.currentPath.pathCapitalCost
        // updateRailwayTracksSelectBox(paths)
        this.currentPath.finalized = true
        this.currentPath.createWayPoints()
        this.currentPath.updateStations()
      } else if (this.state == this.ROUTE_EDITING_STATE && event.key == 'd') {
        if (!this.currentPath.finalized) {
          this.currentPath.popPoint()
          if (this.currentPath.length == 0) {
            this.lastClick.x = null
            this.lastClick.y = null
          }
        }
        // } else if (event.key == 's'){
        //   stationEditMode = !stationEditMode
        //   ctx_strokeStyle = 'black'
        //   updateHUD()
      } else if (this.state == this.ROUTE_EDITING_STATE && event.key == 'a') {
        if (!this.currentPath.finalized) {
          this.lastClick.x = null
          this.lastClick.y = null
          this.money -= this.currentPath.pathCapitalCost
          //updateRailwayTracksSelectBox(paths)
          this.currentPath.finalized = true
        }
        this.currentPath = new Path(this,ctx_foreground)
        this.paths.addPath(currentPath)
      } else if (event.key == ' ') {
        this.selectedPathNum++
        if (this.selectedPathNum > this.paths.numPaths) this.selectedPathNum = 1
        console.log(`selectedPathNum:${this.selectedPathNum}`)
      } else if (this.state == this.RUNNING_STATE) {
        if (this.paths.atLeastOnePathFinalized) {
          this.animationMode = true
          this.i = 0;
          this.paths.createWayPoints()
          this.paths.updateStations()
          this.paths.drawBackground(this.ctx_background)
          this.paths.drawStations(this.ctx_background)
          //cities.draw(ctx_background)
          this.paths.paths.forEach(p => {
            console.log(p.pathCapitalCost)
          })
          if (this.makeSound) audiochugging.play()
          if (this.frames == 0) {
            //this starts up the animation when the game is
            //just starting
            this.animate();
          }
        } else {
          console.log(`No path finalized yet`)
        }
      } else if (this.state == this.PAUSED_STATE) {
        return
      } else if (event.key == 'm') {
        displayPassengersTable(this.passengers.passengers)
        displayTicketPricesTable(this.tickets.tickets)
        document.getElementById('menu').style.zIndex = !menu ? '100' : '0'
        menu = !menu
        console.log(`zIndex: foreground(${this.foreground.style.zIndex}) background(${this.background.style.zIndex} gui(${document.getElementById('menu').style.zIndex})`)
      } else if (event.key == 'rightArrow') {
        //window.scrollBy(10)
      } else if (event.key == 'leftArrow') {
        //window.scrollBy(-10)
      }
      this.ctx_foreground.clearRect(0, 0, this.foreground.width, this.foreground.height)
      this.paths.draw()
    };
  }

  animate = () => {
    //animation did not work when I had this as a normal method syntax
    //but worked with the arrow function method syntax.
    if (this.state == this.RUNNING_STATE) {
      this.ctx_foreground.clearRect(0, 0, this.foreground.width, this.foreground.height)
      this.paths.animate(this.background, this.ctx_foreground)
      this.frames++
      this.period = Math.floor(this.frames / Game.FRAMES_PER_TIME_PERIOD)
      this.megaperiod = Math.floor(this.period / Game.PERIODS_PER_MEGA_PERIOD)
      if ((this.period>0) && (this.period % Game.PERIODS_PER_MEGA_PERIOD == 0)) {
        updatePassengers(this.period, this.cities, this.passengers)
        //updateMoney()
      }
    }
    let txt = ''
    txt += `Period: ${this.period}`
    //Money: ${this.cashflow.closingcash} ${state == PAUSED_STATE ? 'Paused' : ''} Menu: ${menu}`
    this.ctx_foreground.fillText(txt, 0, 40);
    setTimeout(() => {
      if (this.state == this.RUNNING_STATE) {
        this.request = requestAnimationFrame(this.animate)
      }
    }, 150)
  }

  updateHUD(){
    let state_str=''
    switch (this.state) {
      case this.ROUTE_EDITING_STATE:
        state_str=`Route Editing: click f(finalize), a(add route), s(station), t(train), g(game)`
        break;
      case this.STATION_EDITING_STATE:
        state_str=`Station Editing: click n(next route), t(train), g(game)`
        break;
      case this.TRAIN_EDITING_STATE:
        state_str=`Train Editing: +(add coach), -(remove coach), n(next route), g(game)`
        break;
      case this.RUNNING_STATE:
        state_str=`Running: p(pause) Money${this.cashflow.closingcash}`
        break;
      case this.PAUSED_STATE:
        state_str=`Paused: r(Route Editing), s(Station Editing), t(Train Editing), g(game)`
        break;
    
      default:
        break;
    }
    let txt = `State : ${state_str}`
    this.hud.display(txt)
  }
}





