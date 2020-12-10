class Game {
  static PASSENGER_COACH_CAPACITY = 30
  static MIN_LENGTH = 45
  static LINE_WIDTH = 2
  static OPENING_CASH = 1000000
  static FRAMES_PER_TIME_PERIOD = 100
  static PERIODS_PER_MEGA_PERIOD = 100
  static TRACK_COST_PER_UNIT = 1000
  static COST_STATION = 50000
  static COST_ENGINE = 100000
  static COST_GOODS_COACH = 500
  static COST_PASSENGER_COACH=20000
  static INTEREST_EARNED_PER_PERIOD = 0.0005
  static INTEREST_PAID_PER_PERIOD = 0.001
  static DISTANCE_FACTOR = 1.05
  static CITY_RADIUS = 30

  static ROUTE_EDITING_STATE = 1
  static RUNNING_STATE = 4
  static TRAIN_EDITING_STATE = 3
  static PAUSED_STATE = 5

  static TRAVEL_COST_PER_UNIT_DISTANCE = 2
  static FEATURE_LAND = 1
  static FEATURE_WATER = 2
  static FEATURE_TUNNEL = 3

  ms = 150
  period = 0
  megaperiod = 0
  MIN_ANGLE = 90
  makeSound = false

  state = Game.ROUTE_EDITING_STATE
  previous_state = Game.ROUTE_EDITING_STATE
  width = 1200
  height = 675
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
    this.tickets = new Tickets(Game.TRAVEL_COST_PER_UNIT_DISTANCE)

    this.background = document.querySelector('#background')
    this.foreground = document.querySelector('#foreground')
    this.hudElement = document.querySelector('#hud')
    this.tooltipElement = document.querySelector('#tooltip')

    this.background.width = this.width//window.innerWidth
    this.background.height = this.height//window.innerHeight

    this.foreground.width = this.width//window.innerWidth
    this.foreground.height = this.height//window.innerHeight

    this.hudElement.width = this.width//window.innerWidth
    this.hudElement.height = 40 //window.innerHeight

    this.ctx_background = this.background.getContext('2d')
    this.ctx_foreground = this.foreground.getContext('2d')
    this.hud = new Hud(this.hudElement)
    this.tooltip = new ToolTip(this.tooltipElement)

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
    //start in this state
    this.state = Game.ROUTE_EDITING_STATE
    this.updateHUD()
    document.addEventListener("info", e => { 
      //console.log(`Event received: ${e.detail.text}` )
      this.hud.info = e.detail
    })
  }


  addEventListeners() {
    this.foreground.addEventListener('click', (event)=> {
      if (this.state == Game.ROUTE_EDITING_STATE && !this.currentPath.finalized) {
        let city = getClosestCityObject(this.cities,event.offsetX,event.offsetY)
        let clickedWithinCityLimits = 'name' in city
        let finalPoint = {x:clickedWithinCityLimits?city.x:event.offsetX,y:clickedWithinCityLimits?city.y:event.offsetY}
        if (this.lastClick.x === null && clickedWithinCityLimits) {
          //we are adding the first point
          this.currentPath.addPoint(new Point(city.x, city.y))
          this.lastClick.x = city.x
          this.lastClick.y = city.y
        } else if ((this.currentPath.length == 1) && (lineLength(this.lastClick.x, this.lastClick.y, finalPoint.x, finalPoint.y) > 2 * Game.MIN_LENGTH)) {
            this.currentPath.addPoint(new Point(finalPoint.x, finalPoint.y))
            this.lastClick.x = finalPoint.x
            this.lastClick.y = finalPoint.y
        } else if ((this.currentPath.length > 1) && (lineLength(this.lastClick.x, this.lastClick.y, finalPoint.x, finalPoint.y) > 2 * Game.MIN_LENGTH)) {
          let lastTwoPoints = this.currentPath.lastTwoPoints
          if (angleBetweenLinesIsOK(lastTwoPoints[0].x, lastTwoPoints[0].y, lastTwoPoints[1].x, lastTwoPoints[1].y, 
            finalPoint.x, finalPoint.y,this.MIN_ANGLE)) {
            this.currentPath.addPoint(new Point(finalPoint.x, finalPoint.y))
            this.lastClick.x = finalPoint.x
            this.lastClick.y = finalPoint.y
          }
        }
      }
    })
  }

  drawPaths() {
    this.ctx_foreground.clearRect(0, 0, this.foreground.width, this.foreground.height)
    this.paths.draw()
  }

  addMouseListener() {
    document.onmousemove = (event) => {

      if (this.canvases.style.visibility == 'collapse') {
        this.tooltip.clearDisplay()
        return
      }
      document.body.style.cursor = this.state==Game.ROUTE_EDITING_STATE?'crosshair':'default'
      if(this.state==Game.ROUTE_EDITING_STATE){
        this.currentMousePosition.x = event.offsetX
        this.currentMousePosition.y = event.offsetY
        if (!this.currentPath.finalized && this.state==Game.ROUTE_EDITING_STATE) {
          //AJ 12/8/20 Commented out the following
          this.drawPaths()

          //if (this.lastClick.x!=null && distanceToClosestCity(this.cities,event.offsetX,event.offsetY)<= Game.CITY_RADIUS) {
          //console.log(distanceToClosestCity(this.cities,event.offsetX,event.offsetY)<= Game.CITY_RADIUS)
          if (this.lastClick.x!=null) {
            this.ctx_foreground.beginPath()
            this.ctx_foreground.moveTo(this.lastClick.x, this.lastClick.y)
            this.ctx_foreground.lineTo(this.currentMousePosition.x, this.currentMousePosition.y)
            this.ctx_foreground.stroke()
          }
        }
      }else if(this.state==Game.RUNNING_STATE){
        //where is the mouse
        //close to a city?
        let city = this.cities.getClosestCity(event.offsetX,event.offsetY)
        if(city!=null){
          let waiting = Math.floor(this.passengers.numWaitingAt(city.name))
          this.tooltip.display(city,waiting)
        }else{
          this.tooltip.clearDisplay()
        }
      }
    }
  }

  addKeyEventListener() {
    document.onkeypress = (event) => {

      if(event.code==='Space'){
        noncanvases.style.visibility=noncanvases.style.visibility==='collapse'?'visible':'collapse'
        canvases.style.visibility=canvases.style.visibility==='collapse'?'visible':'collapse'
        displayPassengersTable(this.passengers.passengers)
        displayTicketPricesTable(this.tickets.tickets)
        setTimeout(()=>{
           window.scrollTo(0, -30);
        },50)
      }

      if (this.canvases.style.visibility == 'collapse') {
        this.tooltip.clearDisplay()
        return
      }
      this.keyBufffer.addKey(event.key)
      this.updateHUD()
      if (this.state == Game.ROUTE_EDITING_STATE) {
        if (event.key == 'd'){
          if (!this.currentPath.finalized) {
            let deletedPoint = this.currentPath.popPoint()
            this.currentMousePosition = {...deletedPoint}
            if (this.currentPath.length == 0) {
              this.lastClick.x = null
              this.lastClick.y = null
            }
          }
        } else if (event.key == 'a') {
          if(!this.currentPath.isValid){
            //delete this path and set the current path to null
            this.paths.deletePath(this.currentPath)
            this.currentPath = null
            this.selectedPathNum--
          } else if (!this.currentPath.finalized) {
            this.currentPath.finalized = true
            //AJ 12/9/20 removed from here and added only if the path is finalized
            //this.currentPath.createWayPoints()
            //this.currentPath.updateStations()
            this.cashflow.trackcost = this.currentPath.pathCapitalCost
            this.cashflow.enginecost = Game.COST_ENGINE
            this.cashflow.coachcost = Game.COST_PASSENGER_COACH
          }
          this.lastClick.x=null
          this.lastClick.y=null
          this.currentPath = new Path(this,this.ctx_foreground)
          this.paths.addPath(this.currentPath)
          this.selectedPathNum = this.paths.length
        }
      } 
      

      if (this.state == Game.TRAIN_EDITING_STATE) {
        if(!this.currentPath.isValid){
          //delete this path and set the current path to null
          this.paths.deletePath(this.currentPath)
          this.currentPath = null
          this.selectedPathNum--
        }else if(!this.currentPath.finalized){
          this.lastClick.x = null
          this.lastClick.y = null
          this.currentPath.finalized = true
          //AJ 12/9/20 removed from here and added only if the path is finalized
          //this.currentPath.createWayPoints()
          //this.currentPath.updateStations()
          this.cashflow.trackcost = this.currentPath.pathCapitalCost
        }
        if(event.key == 'n'){
          let numPaths = this.paths.numPaths
          this.selectedPathNum++
          if(this.selectedPathNum>numPaths) this.selectedPathNum = 1
          this.updateHUD()
        }
        if (event.key == '+') {  
          this.cashflow.coachcost = Game.COST_PASSENGER_COACH
          this.paths.getPath(this.selectedPathNum).train.addPassengerCoach()
          this.updateHUD()
        }
        if (event.key == '-') {  
          this.cashflow.coachcost = -1 * Game.COST_PASSENGER_COACH
          this.paths.getPath(this.selectedPathNum).train.removePassengerCoach()
          this.updateHUD()
        }
      }
      
      if (this.state == Game.RUNNING_STATE) {
        if(event.key=='r' || event.key=='t'){
          return
        }
        if(event.key == '+'){
          this.ms -=10
          return  
        }
        if(event.key == '-'){
          this.ms +=10
          return  
        }
        if(event.key == 'n'){
          let numPaths = this.paths.numPaths
          this.selectedPathNum++
          if(this.selectedPathNum>numPaths) this.selectedPathNum = 1
          this.updateHUD()
          return
        }
        if(event.key == 'w' || event.key == 'W'){
          this.makeSound = !this.makeSound
          this.updateHUD()
          return  
        }
        if(!this.currentPath.isValid){
          //delete this path and set the current path to null
          this.paths.deletePath(this.currentPath)
          this.currentPath = null
          this.selectedPathNum--
        }else if(!this.currentPath.finalized){
          this.lastClick.x = null
          this.lastClick.y = null
          this.currentPath.finalized = true
          //AJ 12/9/20 removed from here and added only if the path is finalized
          //this.currentPath.createWayPoints()
          //this.currentPath.updateStations()
          this.cashflow.trackcost = this.currentPath.pathCapitalCost
        }
        if (this.paths.atLeastOnePathFinalized) {
          this.animationMode = true
          this.i = 0;
          this.paths.createWayPoints()
          //AJ 12/8/20 commented out the following line..no
          this.paths.drawBackground(this.ctx_background)
          this.paths.drawStations(this.ctx_background)
          //cities.draw(ctx_background)
          if (this.makeSound) this.audiochugging.play()
          this.animate();
        } else {
          console.log(`No path finalized yet`)
        }
      } else if (this.state == Game.PAUSED_STATE) {
        return
      } else if (event.key == 'rightArrow') {
        //window.scrollBy(10)
      } else if (event.key == 'leftArrow') {
        //window.scrollBy(-10)
      }
      this.ctx_foreground.clearRect(0, 0, this.foreground.width, this.foreground.height)
      this.paths.draw()
    };
    // document.onkeypress = (event) => {
    //   if (this.state == Game.RUNNING_STATE){
    //     this.ms += event.key == '+'?-10:event.key == '-'?+10:0 
    //   }
    // }
  }


  animate = () => {
    //animation did not work when I had this as a normal method syntax
    //but worked with the arrow function method syntax.
    
    if (this.state == Game.RUNNING_STATE) {
      if (this.frames % Game.FRAMES_PER_TIME_PERIOD == 0) {
        this.period = Math.floor(this.frames / Game.FRAMES_PER_TIME_PERIOD)
        updatePassengers(this.period, this.cities, this.passengers)
        this.cashflow.updateMaintenanceCost()
        this.cashflow.updateRunningCost()
        this.cashflow.updateInterest()
        this.cashflow.update()
      }
      this.ctx_foreground.clearRect(0, 0, this.foreground.width, this.foreground.height)
      this.paths.animate(this.background, this.ctx_foreground)
      this.frames++
      this.megaperiod = Math.floor(this.period / Game.PERIODS_PER_MEGA_PERIOD)
      if ((this.period>0) && (this.period % Game.PERIODS_PER_MEGA_PERIOD == 0)) {
      }
    }
    // let txt = ''
    // txt += `Period: ${this.period} MS per frame: ${this.ms}`
    // //Money: ${this.cashflow.closingcash} ${state == PAUSED_STATE ? 'Paused' : ''} Menu: ${menu}`
    // this.ctx_foreground.fillText(txt, 0, 40);
    this.updateHUD()
    setTimeout(() => {
      if (this.state == Game.RUNNING_STATE) {
        this.request = requestAnimationFrame(this.animate)
      }
    }, this.ms)
  }

  updateHUD = ()=>{
    let txt=`Pd: ${this.period} G$: ${Math.floor(this.cashflow.closingcash/1000)} K State: `
    switch (this.state) {
      case Game.ROUTE_EDITING_STATE:
        txt=`Route Editing: ${this.previous_state==Game.ROUTE_EDITING_STATE?'click-click, ':''}a(add another route), t(train), g(resume game)`
        break;
      case Game.TRAIN_EDITING_STATE:
        if(this.selectedPathNum==0) this.selectedPathNum=1
        txt+=`Train Editing (${this.paths.getPath(this.selectedPathNum).name}, Coaches:${this.paths.getPath(this.selectedPathNum).train.num_passenger_coaches}): +(add coach), -(remove coach), n(next route), g(resume game)`
        break;
      case Game.RUNNING_STATE:
        txt+=`Running: p(pause), +(speed up), -(slow down), w(${this.makeSound==true?'whistle off':'whistle on'}), n(next train info)`
        break;
      case Game.PAUSED_STATE:
        txt+=`Paused: r(Route Editing), t(Train Editing), g(resume game)`
        break;
    
      default:
        break;
    }
    this.hud.display(txt,this.state,this.selectedPathNum==0?'None':this.paths.paths[this.selectedPathNum-1].name)
  }
}





