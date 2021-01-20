class Game {
  static PASSENGER_COACH_CAPACITY = 30
  static MIN_LENGTH = 45
  static LINE_WIDTH = 2
  static OPENING_CASH = 1000000
  static FRAMES_PER_TIME_PERIOD = 100
  static PERIODS_PER_MEGA_PERIOD = 100
  static TRACK_COST_PER_UNIT = 1000
  static COST_STATION = 200000
  static COST_ENGINE = 500000
  static COST_GOODS_COACH = 500
  static COST_PASSENGER_COACH = 100000
  static INTEREST_EARNED_PER_PERIOD = 0.0005
  static INTEREST_PAID_PER_PERIOD = 0.001
  static DISTANCE_FACTOR = 1.05
  static CITY_RADIUS = 30

  static ROUTE_EDITING_STATE = 1
  static RUNNING_STATE = 4
  static TRAIN_EDITING_STATE = 3
  static PAUSED_STATE = 5
  static READY_TO_EXIT_STATE = 6

  static TRAVEL_COST_PER_UNIT_DISTANCE = 2
  static FEATURE_LAND = 1
  static FEATURE_WATER = 2
  static FEATURE_TUNNEL = 3

  static FARE_FOR_AUDIO = 10
  static WIDTH = 1200
  static HEIGHT = 675

  static WPL = 2
  static START_GAME_NAME = 'My first game'

  ms = 150
  period = 0
  megaperiod = 0
  MIN_ANGLE = 90
  makeSound = false

  state = Game.ROUTE_EDITING_STATE
  //previous_state = Game.ROUTE_EDITING_STATE
  menu = false
  stationEditMode = false
  //animationMode = false
  selectedPathNum = 0
  frames = 0
  //i = 0;


  currentMousePosition = {
    x: 0,
    y: 0
  }
  lastClick = {
    x: null,
    y: null
  }

  constructor(email,gameid,gamename) {
    this.email = email 
    this.gameid = gameid 
    this.gamename = gamename
    this.request = null
    this.canvases = document.getElementById('canvases')
    this.audiowhistle = new Audio('steam engine whistle.mp3')
    this.audiochugging = new Audio('chugging sound.mp3')
    this.money = new Audio('money.mp3')
    this.pop = new Audio('pop.mp3')

    this.passengers = new Passengers()
    this.cities = new Cities()
    updatePassengers(this.period, this.cities, this.passengers)
    this.tickets = new Tickets(Game.TRAVEL_COST_PER_UNIT_DISTANCE)

    this.background = document.querySelector('#background')
    this.foreground = document.querySelector('#foreground')
    this.routedesign = document.querySelector('#routedesign')
    this.hudElement = document.querySelector('#hud')
    this.tooltipElement = document.querySelector('#tooltip')

    this.background.width = Game.WIDTH//window.innerWidth
    this.background.height = Game.HEIGHT//window.innerHeight

    this.foreground.width = Game.WIDTH//window.innerWidth
    this.foreground.height = Game.HEIGHT//window.innerHeight

    this.routedesign.width = Game.WIDTH//window.innerWidth
    this.routedesign.height = Game.HEIGHT//window.innerHeight

    this.hudElement.width = Game.WIDTH//window.innerWidth
    this.hudElement.height = 40 //window.innerHeight

    this.ctx_background = this.background.getContext('2d')
    this.ctx_foreground = this.foreground.getContext('2d')
    this.ctx_routedesign = this.routedesign.getContext('2d')

    this.hud = new Hud(this.hudElement)
    this.tooltip = new ToolTip(this.tooltipElement)

    this.img = new Image()
    this.img.src = "aerialview2.png"
    this.img.onload = () => {
      this.ctx_background.drawImage(this.img, 0, 0, this.background.width, this.background.height)
      this.cities.draw(this.ctx_background)
    }

    this.paths = new Paths(this)
    this.cash = new Cash()
    this.cashflow = new CashFlow(this, Game.OPENING_CASH, 0, 0)

    this.ctx_foreground.lineWidth = Game.LINE_WIDTH
    this.ctx_foreground.globalCompositeOperation = 'source-over'

    this.ctx_foreground.font = "20px Comic Sans MS";
    this.ctx_foreground.fillStyle = "black";

    this.day_and_night = false

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
    document.addEventListener("money", e => {
      this.money.play()
    })
  }


  addEventListeners() {
    this.routedesign.addEventListener('click', (event) => {
      if (this.state == Game.ROUTE_EDITING_STATE) {
        let city = getClosestCityObject(this.cities, event.offsetX, event.offsetY)
        let clickedWithinCityLimits = 'name' in city
        let finalPoint = { x: clickedWithinCityLimits ? city.x : event.offsetX, y: clickedWithinCityLimits ? city.y : event.offsetY }
        if (this.lastClick.x === null && clickedWithinCityLimits) {
          //we are adding the first point within a new path
          this.currentPath = new Path(this, this.ctx_foreground, this.ctx_routedesign)
          this.paths.addPath(this.currentPath)
          this.selectedPathNum = this.numPaths
          this.currentPath.addPoint(new Point(city.x, city.y))
          this.lastClick.x = city.x
          this.lastClick.y = city.y
        } else if (this.currentPath && (this.currentPath.length == 1) && (lineLength(this.lastClick.x, this.lastClick.y, finalPoint.x, finalPoint.y) > 2 * Game.MIN_LENGTH)) {
          this.currentPath.addPoint(new Point(finalPoint.x, finalPoint.y))
          this.lastClick.x = finalPoint.x
          this.lastClick.y = finalPoint.y
        } else if (this.currentPath && (this.currentPath.length > 1) && (lineLength(this.lastClick.x, this.lastClick.y, finalPoint.x, finalPoint.y) > 2 * Game.MIN_LENGTH)) {
          let lastTwoPoints = this.currentPath.lastTwoPoints
          if (angleBetweenLinesIsOK(lastTwoPoints[0].x, lastTwoPoints[0].y, lastTwoPoints[1].x, lastTwoPoints[1].y,
            finalPoint.x, finalPoint.y, this.MIN_ANGLE)) {
            this.currentPath.addPoint(new Point(finalPoint.x, finalPoint.y))
            this.lastClick.x = finalPoint.x
            this.lastClick.y = finalPoint.y
          }
        }
      }
    })
  }

  drawRoutes() {
    this.ctx_routedesign.clearRect(0, 0, this.routedesign.width, this.routedesign.height)
    this.paths.drawRoute()
  }

  addMouseListener() {
    let prevcityname=''
    document.onmousemove = (event) => {

      if (this.canvases.style.visibility == 'collapse') {
        this.tooltip.clearDisplay()
        return
      }
      document.body.style.cursor = this.state == Game.ROUTE_EDITING_STATE ? 'crosshair' : 'default'
      if (this.state == Game.ROUTE_EDITING_STATE) {
        this.currentMousePosition.x = event.offsetX
        this.currentMousePosition.y = event.offsetY
        if (this.currentPath && !this.currentPath.finalized && this.state == Game.ROUTE_EDITING_STATE) {
          this.drawRoutes()

          //if (this.lastClick.x != null) {
            
            //testing 01/14/21
            let lastTwoPoints = this.currentPath.lastTwoPoints
            let bOK = ((this.currentPath.length == 1) || ((this.currentPath.length > 1) && 
                (lineLength(this.lastClick.x, this.lastClick.y, this.currentMousePosition.x, this.currentMousePosition.y) > 2 * Game.MIN_LENGTH) &&
                (angleBetweenLinesIsOK(lastTwoPoints[0].x, lastTwoPoints[0].y, lastTwoPoints[1].x, lastTwoPoints[1].y,
                  this.currentMousePosition.x, this.currentMousePosition.y, this.MIN_ANGLE)))) 
            document.body.style.cursor = bOK ? 'crosshair' : 'not-allowed'
            this.ctx_routedesign.beginPath()
            this.ctx_routedesign.moveTo(this.lastClick.x, this.lastClick.y)
            this.ctx_routedesign.lineTo(this.currentMousePosition.x, this.currentMousePosition.y)
            this.ctx_routedesign.stroke()
          //}
        }
      } else if (this.state == Game.RUNNING_STATE) {
        //where is the mouse
        //close to a city?
        let city = this.cities.getClosestCity(event.offsetX, event.offsetY)
        if (city != null) {
          if(city.name != prevcityname){
            let waiting = this.passengers.numWaitingForCities(city.name)
            this.tooltip.display(city, waiting)
            prevcityname = city.name
          }
        } else {
          this.tooltip.clearDisplay()
          prevcityname=''
        }
      }
    }
  }

  addKeyEventListener() {
    //document.onkeypress = (event) => {
    document.onkeyup = (event) => {

      if (event.code === 'Space') {
        noncanvases.style.visibility = noncanvases.style.visibility === 'collapse' ? 'visible' : 'collapse'
        canvases.style.visibility = canvases.style.visibility === 'collapse' ? 'visible' : 'collapse'
        displayPassengersTable(this.passengers.passengers)
        displayTicketPricesTable(this.tickets.tickets)
        displayPerformanceTable(this.cash)
        setTimeout(() => {
          window.scrollTo(0, -30);
        }, 50)
      }

      if (this.canvases.style.visibility == 'collapse') {
        this.tooltip.clearDisplay()
        return
      }
      
      if (this.state == Game.ROUTE_EDITING_STATE) {
        if (event.key == 'd') {
          if (!this.currentPath.finalized) {
            let deletedPoint = this.currentPath.popPoint()
            this.currentMousePosition = { ...deletedPoint }
            if (this.currentPath.length == 0) {
              this.lastClick.x = null
              this.lastClick.y = null
            }
          }
        } else if (event.key == 't') {
          if (!this.currentPath.isValid) {
            //delete this path and set the current path to null
            this.paths.deletePath(this.currentPath)
            this.currentPath = null
          } else if (!this.currentPath.finalized) {
            this.currentPath.finalized = true
            this.lastClick.x = null
            this.lastClick.y = null
          }
          this.selectedPathNum = this.numPaths
          this.state = Game.TRAIN_EDITING_STATE
          this.updateHUD()
        }else if (event.key == 'g') {
          if(this.currentPath){
            //sometimes a user may not complete a path and press g
            if (!this.currentPath.isValid) {
              //delete this path and set the current path to null
              this.paths.deletePath(this.currentPath)
              this.currentPath = null
            } else if (!this.currentPath.finalized) {
              this.currentPath.finalized = true
              this.lastClick.x = null
              this.lastClick.y = null
            }
          }
          this.selectedPathNum = this.numPaths
          if (this.paths.atLeastOnePathFinalized) {
            //this.animationMode = true
            //this.i = 0;
            //this.paths.createWayPoints()
            //AJ 12/8/20 commented out the following line..no
            this.paths.drawBackground(this.ctx_background)
            this.paths.drawStations(this.ctx_background)
            if (this.makeSound) this.audiochugging.play()
            this.ctx_routedesign.clearRect(0,0,this.routedesign.width,this.routedesign.height)
            this.state = Game.RUNNING_STATE
            this.animate();
          } else {
            console.log(`No path finalized yet`)
          }
        }else if(event.key == 'a' || event.key == 'Escape'){
          if (this.currentPath != null) {
            if (!this.currentPath.isValid) {
              //delete this path and set the current path to null
              this.paths.deletePath(this.currentPath)
              this.currentPath = null
            } else if (!this.currentPath.finalized) {
              this.currentPath.finalized = true
            }
          }
          console.log("escape key pressed")
          this.lastClick.x = null
          this.lastClick.y = null
          this.selectedPathNum = this.numPaths
          
        }else{
          console.log(`${event.key} pressed`)
        }
      }
      
      if (this.state == Game.TRAIN_EDITING_STATE) {
        if (!this.currentPath.isValid) {
          //delete this path and set the current path to null
          this.paths.deletePath(this.currentPath)
          this.currentPath = null
          this.selectedPathNum = this.numPaths
        } else if (!this.currentPath.finalized) {
          this.lastClick.x = null
          this.lastClick.y = null
          this.currentPath.finalized = true
        }
        if (event.key == 'n') {
          this.selectedPathNum++
          if (this.selectedPathNum > this.numPaths) this.selectedPathNum = 1
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
        if (event.key == 'g' || event.key == 'G') {
          if (this.paths.atLeastOnePathFinalized) {
            this.paths.drawBackground(this.ctx_background)
            this.paths.drawStations(this.ctx_background)
            if (this.makeSound) this.audiochugging.play()
            this.ctx_routedesign.clearRect(0,0,this.routedesign.width,this.routedesign.height)
            this.state = Game.RUNNING_STATE
            this.updateHUD()
            this.animate();
          } else {
            console.log(`No path finalized yet`)
          }
        }
      }

      if (this.state == Game.READY_TO_EXIT_STATE) {
        if (event.key == 'g' || event.key == 'G') {
          this.state == Game.RUNNING_STATE
          return
        }
        if (event.key == 'x' || event.key == 'X') {
          alert('Game Over')
        }
        
      }

      if (this.state == Game.RUNNING_STATE) {
        if (event.key == 'r' || event.key == 't') {
          return
        }
        if (event.key == '+') {
          this.ms -= 10
          return
        }
        if (event.key == '-') {
          this.ms += 10
          return
        }
        if (event.key == 'n') {
          this.selectedPathNum++
          if (this.selectedPathNum > this.numPaths) this.selectedPathNum = 1
          this.updateHUD()
          return
        }
        if (event.key == 'w' || event.key == 'W') {
          this.makeSound = !this.makeSound
          this.updateHUD()
          return
        }
        if (event.key == 'p' || event.key == 'P') {
          this.state = Game.PAUSED_STATE  
          this.updateHUD()
          return
        }
        if(this.currentPath){
          if (!this.currentPath.isValid) {
            //delete this path and set the current path to null
            this.paths.deletePath(this.currentPath)
            this.currentPath = null
          } else if (!this.currentPath.finalized) {
            this.lastClick.x = null
            this.lastClick.y = null
            this.currentPath.finalized = true
          }
          this.selectedPathNum = this.numPaths
        }
        this.ctx_foreground.clearRect(0, 0, this.foreground.width, this.foreground.height)
        this.paths.draw()
        //this.keyBufffer.addKey(event.key)
        this.updateHUD()
      } 
      
      if (this.state == Game.PAUSED_STATE) {
        if (event.key == 'g' || event.key == 'G') {
          this.state = Game.RUNNING_STATE
          this.animate()
          return
        } else if (event.key == 'r' || event.key == 'R'){
          this.state = Game.ROUTE_EDITING_STATE
          this.updateHUD()
          return
        } else if (event.key == 'rightArrow') {
          return
        } else if (event.key == 'leftArrow') {
          return
        } else if (event.key=='t'||event.key=='T'){
          this.state = Game.TRAIN_EDITING_STATE  
          this.updateHUD()
          return
        }else if (event.key=='x'||event.key=='X'){
          this.state = Game.READY_TO_EXIT_STATE  
          this.updateHUD()
          return
        }
      }

      this.ctx_foreground.clearRect(0, 0, this.foreground.width, this.foreground.height)
      this.paths.draw()
      //this.keyBufffer.addKey(event.key)
      this.updateHUD()
    };
  }


  animate = async() => {
    //animation did not work when I had this as a normal method syntax
    //but worked with the arrow function method syntax.
    let pu = new Popup(
      10000,
      this.makeSound,
      this.pop
      )
    if (this.state == Game.RUNNING_STATE) {
      if(this.day_and_night){
        this.background.style.filter = `brightness(${getBrightness(this.frames)})`
      }
      if (this.frames % Game.FRAMES_PER_TIME_PERIOD == 0) {
        this.period = Math.floor(this.frames / Game.FRAMES_PER_TIME_PERIOD)
        updatePassengers(this.period, this.cities, this.passengers)
        this.cashflow.update()
        this.cash.add(
          {
            openingcash: this.cashflow._openingcash,
            openingcumcapitalcost: this.cashflow._openingcumcapitalcost,
            openingcumdepreciation: this.cashflow._openingcumdepreciation,
            interest: this.cashflow.interest,
            ticketsales: this.cashflow.ticketsales,
            depreciation: this.cashflow._depreciation,
            trackcost: this.cashflow._trackcost,
            stationcost: this.cashflow._stationcost,
            enginecost: this.cashflow._enginecost,
            coachcost: this.cashflow._coachcost,
            runningcost: this.cashflow._runningcost,
            maintenancecost: this.cashflow._maintenancecost,
            profit: this.cashflow._profit,
            tax: this.cashflow.tax,
            patd: this.cashflow.patd,
            closingcumcapitalcost: this.cashflow._closingcumcapitalcost,
            closingcumdepreciation: this.cashflow._closingcumdepreciation,
            closingcash: this.cashflow._closingcash,
            cumtrackcost: this.cashflow.cumtrackcost,
            cumstationcost: this.cashflow.cumstationcost,
          }
        )
        //save the game to db
        //first get the gameperiodid
        //Todo: we need to get the cashid and passengerid
        let json = getGamePeriodId(this.gameid,this.period,0,this.cashflow._openingcash,this.cashflow._openingcumcapitalcost,
          this.cashflow._openingcumdepreciation,this.cashflow._cumtrackcost,this.cashflow._cumstationcost,
          this.cashflow._maintenancecost+this.cashflow._runningcost,this.cashflow._ticketsales,this.cashflow._interest,
          this.cashflow._tax,this.cashflow.profit,this.cashflow._cumcoachcost,this.cashflow._cumenginecost)
        json.then(data=>{
          this.gameperiodid=data[0]
          this.savePeriodDataToDB()
        }).catch(err=>{
          console.error(`Error in getGamePeriodId`)
        })
        this.cashflow.initPeriodVariables()
        let milestone = getMilestone(this)
        if(milestone!=null){
          pu.show(milestone)
          // let b=new Balloon(this.ctx_foreground,500,500,"abc")
          // b.show()    
        }
      }
      this.ctx_foreground.clearRect(0, 0, this.foreground.width, this.foreground.height)
      this.paths.animate(this.background, this.ctx_foreground)
      this.frames++
      this.megaperiod = Math.floor(this.period / Game.PERIODS_PER_MEGA_PERIOD)
      if ((this.period > 0) && (this.period % Game.PERIODS_PER_MEGA_PERIOD == 0)) {
      }
    }
    this.updateHUD()
    setTimeout(() => {
      if (this.state == Game.RUNNING_STATE) {
        this.request = requestAnimationFrame(this.animate)
      }
    }, this.ms)
  }

  updateHUD = () => {
    let txt = `Pd: ${this.period} G$: ${Math.floor(this.cashflow.closingcash / 1000)} K State: `
    switch (this.state) {
      case Game.ROUTE_EDITING_STATE:
        txt = `Route Editing: click-click, a(add another route), t(train), g(resume game), space(docs and back), x(exit)`
        break;
      case Game.TRAIN_EDITING_STATE:
        if (this.selectedPathNum == 0) this.selectedPathNum = 1
        txt += `Train Editing (${this.paths.getPath(this.selectedPathNum).name}, Coaches:${this.paths.getPath(this.selectedPathNum).train.num_passenger_coaches}): +(add coach), -(remove coach), n(next route), g(resume game), space(docs and back), x(exit)`
        break;
      case Game.RUNNING_STATE:
        txt += `Running: p(pause), +(speed up), -(slow down), w(${this.makeSound == true ? 'whistle off' : 'whistle on'}), n(next train info), space(docs and back), x(exit)`
        break;
      case Game.PAUSED_STATE:
        txt += `Paused: r(Route Editing), t(Train Editing), g(resume game), space(docs and back), x(exit)`
        break;
      case Game.READY_TO_EXIT_STATE:
        txt += `Ready to exit: g(resume game), n(new game), s(switch to another game) space(docs and back), x(exit) `
        break;

      default:
        break;
    }
    this.hud.display(txt, this.state, this.selectedPathNum == 0 ? 'None' : this.paths.paths[this.selectedPathNum-1].name)
  }
  get numPaths(){
    return this.paths.numPaths
  }

  savePeriodDataToDB = () => {
    //if the save is being done for the first time, we do not have an gameid for the game
    //we do not save if this.email is 'anonymous'
    if(this.email=='anonymous') return
    console.log(`Saving game to db for ${this.gameid}, ${this.period}`)
    this.paths.savePeriodDataToDB(this.gameperiodid)
    //this.passengers.savePeriodDataToDB(this.gameid,this.period)

  }
  loadFromDB = () =>{
    console.log(`Game being loaded from DB:${this.id}` )
  }
  async createGameInDB(){
     this.gameid = await createUserAndDefaultGame(this.email,this.gamename)
     console.log(`Game created with a gameid of ${gameid}`)
  }
  
}





