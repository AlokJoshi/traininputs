class Game {
  //following static variables are refernced with Game.xxx
  static PASSENGER_COACH_CAPACITY = 30
  static WAGON_CAPACITY = 100
  static MIN_LENGTH = 45
  static LINE_WIDTH = 2
  static OPENING_CASH = 1000000
  static FRAMES_PER_TIME_PERIOD = 100
  static PERIODS_PER_MEGA_PERIOD = 100
  static TRACK_COST_PER_UNIT = 1000
  static COST_STATION = 200000
  static COST_ENGINE = 500000
  static COST_PASSENGER_COACH = 100000
  static COST_GOODS_COACH = 50000
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

  static HIGHWAY = 1
  static COUNTRYROAD = 2

  static TREE_IMAGE = document.getElementById('treeimage')
  static PLANE_IMAGE = document.getElementById('airplaneimage')

  static TUNNEL_COST_MULTIPLIER = 20
  static BRIDGE_COST_MULTIPLIER = 20

  static PERIODS_TO_SUMMARIZE = 10

  static LEADERBOARDPERIODS = [50, 100, 200, 300, 400, 500]

  //following variables are referenced with this.xx in Game methods
  ms = 50
  period = 0
  megaperiod = 0
  MIN_ANGLE = 90
  makeSound = false
  state = Game.ROUTE_EDITING_STATE
  previousstate = null
  menu = false
  stationEditMode = false
  selectedPathNum = 0
  frames = 0
  currentMousePosition = {
    x: 0,
    y: 0
  }
  lastClick = {
    x: null,
    y: null
  }

  constructor(email, gameid, gamename) {
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
    this.goods = new Goods()
    this.cities = new Cities()
    updatePassengers(this.period, this.cities, this.passengers)
    updateGoods(this.period, this.cities, this.goods)
    this.tickets = new Tickets(Game.TRAVEL_COST_PER_UNIT_DISTANCE)

    this.background = document.querySelector('#background')
    this.foreground = document.querySelector('#foreground')
    this.routedesign = document.querySelector('#routedesign')
    this.hudElement = document.querySelector('#hud')
    this.cloudsElement = document.querySelector('#cloud')
    this.tooltipElement = document.querySelector('#tooltip')
    this.buttonmenu = document.querySelector('#buttonmenu')

    this.background.width = Game.WIDTH
    this.background.height = Game.HEIGHT
    this.buttonmenu.width = 50
    this.buttonmenu.top = 0
    this.buttonmenu.left = 1150

    this.foreground.width = Game.WIDTH
    this.foreground.height = Game.HEIGHT

    this.routedesign.width = Game.WIDTH
    this.routedesign.height = Game.HEIGHT

    this.cloudsElement.width = Game.WIDTH
    this.cloudsElement.height = Game.HEIGHT

    this.hudElement.width = Game.WIDTH
    this.hudElement.height = 40

    this.ctx_background = this.background.getContext('2d')
    this.ctx_foreground = this.foreground.getContext('2d')
    this.ctx_routedesign = this.routedesign.getContext('2d')
    this.ctx_clouds = this.cloudsElement.getContext('2d')

    this.hud = new Hud(this.hudElement)
    this.tooltip = new ToolTip(this.tooltipElement)

    this.img = new Image()
    this.img.src = "aerialview2.png"
    this.carimage = document.getElementById('carimage')
    this.cartimage = document.getElementById('cartimage')
    this.truckimage = document.getElementById('truckimage')
    this.cloudimage = document.getElementById('cloudimage')

    this.img.onload = () => {
      this.ctx_background.drawImage(this.img, 0, 0, this.background.width, this.background.height)
      this.cities.draw(this.ctx_background)
      this.water = new Water(Game.WIDTH, Game.HEIGHT, this.ctx_background, this.ctx_foreground)
    }
    this.cloud = new Cloud(this.cloudsElement.width, this.cloudsElement.height, this.cloudimage, this.ctx_clouds)

    this.paths = new Paths(this)
    this.currentPath = null
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
    this.bezierPaths = new BezierPaths(this.ctx_background, this.ctx_foreground, 'rgb(224,224,224)')

    this.vehicles = new Vehicles(this.ctx_foreground, this.ctx_background)

    //mumba to haybad
    //this.bezierPaths.add(0.25,0.1,0.0,1.0,80,60,840,120)
    let rd = this.bezierPaths.add(0, 0, 1, 1.0, 80, 60, 840, 120, 10, Game.HIGHWAY)
    this.vehicles.add(rd, this.carimage, 3)
    this.vehicles.add(rd, this.truckimage, 8)

    //haybad to Bangro
    rd = this.bezierPaths.add(0, 0, 1, 1.0, 840, 120, 940, 410, 5, Game.HIGHWAY)
    this.vehicles.add(rd, this.carimage, 1)
    this.vehicles.add(rd, this.truckimage, 5)

    //Kata to Lochin
    this.bezierPaths.add(0, 0, 1, 1.0, 1090, 560, 750, 590, 10, Game.HIGHWAY)

    //Oooby to Mannai
    this.bezierPaths.add(0, 0, 1, 1.0, 580, 300, 440, 610, 3, Game.HIGHWAY)

    //Mumba to Mannai
    this.bezierPaths.add(0, 0, 1, 1.0, 80, 60, 440, 610, 10, Game.HIGHWAY)

    //road from Haybad to the fields
    rd = this.bezierPaths.add(0, 0, 1, 1, 840, 120, 1100, 120, 1, Game.COUNTRYROAD)
    this.vehicles.add(rd, cartimage, 1)

    //road from Poa to the fields
    rd = this.bezierPaths.add(0.8, 0, 1, 1, 1020, 290, 1150, 170, 1, Game.COUNTRYROAD)
    this.vehicles.add(rd, cartimage, 1)

    this.bezierPaths.drawRoads()

    this.socket = io()
    this.chat = new Chat(this.socket)
    this.milestone = new Milestone(this.socket, this.email)
    this.milestone.send(0, `Game started`)

    //todo: later I should convert it into a Fields class
    this.fields = []
    for (let j = 0; j < 4; j++) {
      let numcols = j < 2 ? 7 : j < 3 ? 6 : 5
      for (let i = 0; i < numcols; i++) {
        this.fields.push(new Field(900 + (i * 40 + i * 1), 120 + j * 30 + j * 1, 40, 30, this.ctx_foreground, this.ctx_background))
      }
    }

    //factories
    this.factories = []
    for (let i = 0; i < 3; i++) {
      this.factories.push(new TimberMill(40 + i * 30, 450 + i * 50, 20, 8, 60 - i * 30, this.ctx_foreground))
    }

    this.villages = new Villages()
    this.plane = new Plane([
      { x1: 0, y1: 0.8, x2: 1, y2: 1, fromx: -100, fromy: 700, tox: 1340, toy: 120, d: 5 },
      { x1: 0.5, y1: 0.8, x2: 1, y2: 0.6, fromx: 1340, fromy: 120, tox: -100, toy: 200, d: 5 },
      { x1: 0.5, y1: 0.8, x2: 1, y2: 1, fromx: 400, fromy: -120, tox: 1400, toy: 800, d: 5 }
    ], this.ctx_foreground)

    document.addEventListener("info", e => {
      this.hud.info = e.detail
    })
    document.addEventListener("money", e => {
      this.money.play()
    })

    document.title=`Train Tycoon${this.gamename ? "-" + this.gamename : ""}`
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
    let prevcityname = ''
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
          if (city.name != prevcityname) {
            let waiting = this.passengers.numWaitingForCities(city.name)
            this.tooltip.display(city, waiting)
            prevcityname = city.name
          }
        } else {
          this.tooltip.clearDisplay()
          prevcityname = ''
        }
      }
    }
  }

  addKeyEventListener() {
    //document.onkeypress = (event) => {
    document.onkeyup = (event) => {

      if (event.key === ' ') {
        //console.log(`Space key pressed`)
        noncanvases.style.visibility = noncanvases.style.visibility === 'collapse' ? 'visible' : 'collapse'
        canvases.style.visibility = canvases.style.visibility === 'collapse' ? 'visible' : 'collapse'
        displayPassengersTable(this.passengers.passengers)
        displayTicketPricesTable(this.tickets.tickets)
        displayPerformanceTable(this.cash)
        displayLeaderboardTable(this.email, Game.LEADERBOARDPERIODS)
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
          if (this.currentPath && !this.currentPath.finalized) {
            this.currentPath.popPoint()
            if (this.currentPath.length == 0) {
              this.lastClick.x = null
              this.lastClick.y = null
              this.currentPath = null
            } else {
              this.lastClick.x = this.currentPath.points[this.currentPath.length - 1].x
              this.lastClick.y = this.currentPath.points[this.currentPath.length - 1].y
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
        } else if (event.key == 'g') {
          if (this.currentPath) {
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
            this.paths.drawBackground(this.ctx_background)
            this.paths.drawStations(this.ctx_background)
            this.bezierPaths.drawRoads()
            if (this.makeSound) this.audiochugging.play()
            this.ctx_routedesign.clearRect(0, 0, this.routedesign.width, this.routedesign.height)
            this.state = Game.RUNNING_STATE
            this.animate();
          } else {
            console.log(`No path finalized yet`)
            let pu = new Popup(5000, false)
            pu.show(`Create a route(s) and then the train(s) will start on those route(s)`)
          }
        } else if (event.key == 'a' || event.key == 'Escape') {
          if (this.currentPath != null) {
            if (!this.currentPath.isValid) {
              //delete this path and set the current path to null
              this.paths.deletePath(this.currentPath)
              this.currentPath = null
            } else if (!this.currentPath.finalized) {
              this.currentPath.finalized = true
            }
          }
          //console.log("escape key pressed")
          this.lastClick.x = null
          this.lastClick.y = null
          this.selectedPathNum = this.numPaths
        } else if (event.key == 'x') {
          this.exit()
        } else {
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
        if (event.key == '>') {
          this.cashflow.wagoncost = Game.COST_GOODS_COACH
          this.paths.getPath(this.selectedPathNum).train.addGoodsCoach()
          this.updateHUD()
        }
        if (event.key == '<') {
          this.cashflow.wagoncost = -1 * Game.COST_GOODS_COACH
          this.paths.getPath(this.selectedPathNum).train.removeGoodsCoach()
          this.updateHUD()
        }
        if (event.key == 'g' || event.key == 'G') {
          if (this.paths.atLeastOnePathFinalized) {
            this.paths.drawBackground(this.ctx_background)
            this.paths.drawStations(this.ctx_background)
            this.bezierPaths.drawRoads()
            if (this.makeSound) this.audiochugging.play()
            this.ctx_routedesign.clearRect(0, 0, this.routedesign.width, this.routedesign.height)
            this.state = Game.RUNNING_STATE
            this.updateHUD()
            this.animate();
          } else {
            console.log(`No path finalized yet`)
          }
        }
        if (event.key == 'x') {
          this.exit()
        }
      }

      if (this.state == Game.READY_TO_EXIT_STATE) {
        if (event.key == 'g' || event.key == 'G') {
          this.state = Game.RUNNING_STATE
          this.animate()
          return
        }
        if (event.key == 'r' || event.key == 'R') {
          //this.state = Game.PAUSED_STATE
          let inputbox = new Myinputbox('Rename Game','Game name in less than 100 characters',this.gamename,(ok,value)=>{
            if(ok && value && value.trim()!=''){
              value = value.trim().substring(0,100)
              this.updateGameName(this.gameid,value)
              this.gamename = value
            }
          })
          //this.state=this.previousstate
          //if(this.state==Game.RUNNING_STATE) this.animate()
          return
        }
        if (event.key == 'n' || event.key == 'N') {
          this.state = Game.PAUSED_STATE
          this.createNewGameInDB()
          return
        }
        if (event.key == 'y' || event.key == 'Y') {
          let pu = new Popup(
            4000,
            true,
            this.pop
          )
          pu.show("Thanks for playing Train Tycoon. Come back again and play some more games.")
          let event1 = new KeyboardEvent("keyup", { "code": "p" })
          document.dispatchEvent(event1)
          let event2 = new KeyboardEvent("keyup", { "code": "Space" });
          document.dispatchEvent(event2)
        }

      }

      if (this.state == Game.RUNNING_STATE) {
        if (event.key == 'x') {
          this.exit()
        }
        if (event.key == 'r' || event.key == 't') {
          return
        }
        if (event.key == '+') {
          this.ms -= (this.ms >= 0 ? 10 : 0)
          return
        }
        if (event.key == '-') {
          this.ms += (this.ms <= 500 ? 10 : 0)
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
        if (this.currentPath) {
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
        } else if (event.key == 'r' || event.key == 'R') {
          this.state = Game.ROUTE_EDITING_STATE
          this.updateHUD()
          return
        } else if (event.key == 'rightArrow') {
          return
        } else if (event.key == 'leftArrow') {
          return
        } else if (event.key == 't' || event.key == 'T') {
          this.state = Game.TRAIN_EDITING_STATE
          this.updateHUD()
          return
        } else if (event.key == 'x' || event.key == 'X') {
          this.state = Game.READY_TO_EXIT_STATE
          this.updateHUD()
          return
        }
        if (event.key == 'x') {
          this.exit()
        }
      }

      this.ctx_foreground.clearRect(0, 0, this.foreground.width, this.foreground.height)
      this.paths.draw()
      //this.keyBufffer.addKey(event.key)
      this.updateHUD()
    };
  }


  animate = async () => {
    //animation did not work when I had this as a normal method syntax
    //but worked with the arrow function method syntax.

    if (this.state == Game.RUNNING_STATE) {
      if (this.day_and_night) {
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
            wagoncost: this.cashflow._wagoncost,
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
        if (this.gameid) {
          try {
            let data = await getGamePeriodId(this.gameid, this.period, 0, this.cashflow._openingcash, this.cashflow._openingcumcapitalcost,
              this.cashflow._openingcumdepreciation, this.cashflow._cumtrackcost, this.cashflow._cumstationcost,
              this.cashflow._maintenancecost + this.cashflow._runningcost, this.cashflow._ticketsales, this.cashflow._interest,
              this.cashflow._tax, this.cashflow.profit, this.cashflow._cumcoachcost, this.cashflow._cumenginecost)
            this.gameperiodid = data[0]
            //console.log(`Game period id returned by getGamePeriodId: ${this.gameperiodid}`)
            this.savePeriodDataToDB()
          }
          catch (err) {
            console.error(`Error in getGamePeriodId`)
          }
        }
        this.cashflow.initPeriodVariables()
        let milestone = getMilestone(this)
        if (milestone != null) {
          let pu = new Popup(
            10000,
            this.makeSound,
            this.pop
          )
          pu.show(milestone)
        }
      }
      this.ctx_foreground.clearRect(0, 0, this.foreground.width, this.foreground.height)
      this.bezierPaths.animate()
      this.vehicles.animate()
      this.factories.forEach(f => f.animate())
      this.fields.forEach(f => f.animate())
      this.villages.animate(this.period, this.ctx_foreground)
      //this.field.animate()
      this.paths.animate(this.ctx_foreground, this.frames)
      this.water.animate()
      this.plane.animate()
      this.cloud.animate()
      this.frames++
      this.megaperiod = Math.floor(this.period / Game.PERIODS_PER_MEGA_PERIOD)
      if ((this.period > 0) && (this.period % Game.PERIODS_PER_MEGA_PERIOD == 0)) {
      }
    }
    updateHUDnew(this.period,Math.round(this.cashflow._openingcash/1000)+'K')
    this.updateHUD()
    setTimeout(() => {
      if (this.state == Game.RUNNING_STATE) {
        this.request = requestAnimationFrame(this.animate)
      }
    }, this.ms)
  }

  updateHUD = () => {
    //remove active from all divs that re children of buttonmenu
    let arr = [...this.buttonmenu.querySelectorAll('div')]
    arr.forEach(element => element.classList.remove('active'))
    let id = null //the id of the div within the buttonmenu element that has to have the active class

    let txt = `State: `
    switch (this.state) {
      case Game.ROUTE_EDITING_STATE:
        txt += `Route Editing: click-click, d(delete last click), a(add another route), t(train), g(resume game), space(docs and back), x(exit)`
        id = "#routeeditstate"
        break;
      case Game.TRAIN_EDITING_STATE:
        if (this.selectedPathNum == 0) this.selectedPathNum = 1
        let train = this.paths.getPath(this.selectedPathNum).train
        txt += `Train Editing (${this.paths.getPath(this.selectedPathNum).name}, coaches:${train.passengercoaches}, wagons:${train.goodscoaches}): +(add coach), -(remove coach), >(add wagon), <(remove wagon), n(next route), g(resume game), space(docs and back), x(exit)`
        id = "#traineditstate"
        break;
      case Game.RUNNING_STATE:
        txt += `Running: p(pause), +(speed up), -(slow down), w(${this.makeSound == true ? 'whistle off' : 'whistle on'}), n(next train info), space(docs and back), x(exit)`
        id = "#runningstate"
        break;
      case Game.PAUSED_STATE:
        txt += `Paused: r(Route Editing), t(Train Editing), g(resume game), space(docs and back), x(exit)`
        id = "#pausedstate"
        break;
      case Game.READY_TO_EXIT_STATE:
        txt += `Ready to exit: g(resume game), n(new game), r(rename game), s(switch to another game) space(docs and back), y(yes I want to exit) `
        id = "#readytoexitstate"
        break;

      default:
        break;
    }
    this.hud.display(txt, this.selectedPathNum == 0 ? 'None' : this.paths.paths[this.selectedPathNum - 1].name)
    if(id){
      let selecteddiv = this.buttonmenu.querySelector(id)
      selecteddiv.classList.add('active')
    }
  }

  updateGameName = async (gameid,newname) => {
    //get the name of the game
    await updateGameNameInDB(gameid, newname)
  }

  get numPaths() {
    return this.paths.numPaths
  }

  savePeriodDataToDB = async () => {
    //console.log(`Saving game to db for ${this.gameid}, ${this.period}`)
    await this.paths.savePeriodDataToDB(this.gameperiodid)
  }

  loadFromDB = async () => {
    console.log(`Game being loaded from DB:${this.gameid}`)
    //load game name
    let gamename = await getGameName(this.gameid)
    document.title=`Train Tycoon${gamename ? "-" + gamename : ""}`

    this.gamename = gamename
    //load from gameperiod
    let gameperiod_data = await getGamePeriodData(this.gameid)
    //console.log(JSON.stringify(gameperiod_data))
    let numPeriods = gameperiod_data.rowCount
    let dataArray = gameperiod_data.rows
    // console.log(numPeriods)
    // console.log(JSON.stringify(dataArray))
    for (let i = 0; i < numPeriods; i++) {
      //create a cashflow object 
      this.cashflow = new CashFlow()
      this.cashflow.game = this
      this.cashflow._openingcash = dataArray[i].openingcash
      this.cashflow._openingcumcapitalcost = dataArray[i].openingcumcapitalcost
      this.cashflow._openingcumdepreciation = dataArray[i].openingcumdepreciation
      this.cashflow._interest = dataArray[i].interest
      this.cashflow._ticketsales = dataArray[i].sales
      this.cashflow._profit = dataArray[i].profit
      this.cashflow._tax = dataArray[i].tax
      this.cashflow._cumtrackcost = dataArray[i].cumtrackcost
      this.cashflow._cumstationcost = dataArray[i].cumstationcost
      this.cashflow._cumcoachcost = dataArray[i].cumcoachcost
      this.cashflow._cumwagoncost = dataArray[i].cumwagoncost
      this.cashflow._cumenginecost = dataArray[i].cumenginecost
      this.cash.add(this.cashflow)
    }
    this.cashflow.update()

    //fix the frames based on the number of periods
    this.frames = Game.FRAMES_PER_TIME_PERIOD * numPeriods

    //now create all the paths for the game
    let path_data = await getPathData(this.gameid)
    let numPaths = path_data.length
    let pathArray = path_data
    // console.log(numPaths)
    // console.log(JSON.stringify(pathArray[0]))
    this.paths = new Paths(this)
    for (let iPath = 0; iPath < numPaths; iPath++) {
      let path = new Path(this, this.ctx_foreground, this.ctx_routedesign)
      path.game = this
      path.number = pathArray[iPath].routenumber
      path._finalized = pathArray[iPath].finalized
      path.points = pathArray[iPath].pathpoints
      path.wp = pathArray[iPath].wparray
      let pathid = pathArray[iPath].id
      path.PathIdInDB = pathid
      path._train = new Train(path, pathArray[iPath].passengercoaches, pathArray[iPath].goodscoaches)

      //add all the stations in that paths
      // path.stations = []
      // let stations = await getStations(pathid)
      // for (let i = 0; i < stations.length; i++) {
      //   let station = new Station(path, stations[i].name, stations[i].wpn, stations[i].x, stations[i].y)
      //   path.stations.push(station)
      // }
      let stations = pathArray[iPath].starray
      //in the station object returned all the values are string values
      //we might need to convert them into numeric by multiplying them by 1
      //either here or in the constructor?
      stations.forEach(st => {
        let station = new Station(path, st.name, st.wpn, st.x, st.y)
        path.stations.push(station)
      })

      this.paths.addPath(path)
    }
    this.selectedPathNum = 0
    this.currentPath = this.paths._paths[this.selectedPathNum]
    console.log(`selectedPathNum value set to: ${this.selectedPathNum}`)


  }

  async createGameInDB() {
    this.gameid = await createUserAndDefaultGame(this.email, this.gamename)
    console.log(`Game created with a gameid of ${gameid}`)
  }

  async createNewGameInDB() {
    let games = await getAllGamesForEmail(email)
    let gamename=`New Game #${games.length}`
    let promise = await addGameForEmail(this.email, gamename)
    let gameid = promise[0]
    localStorage.setItem('gameid',gameid)
    game = new Game(this.email, gameid, gamename)
  }

  exit() {
    this.previousstate = this.state
    this.state = Game.READY_TO_EXIT_STATE
  }

}





