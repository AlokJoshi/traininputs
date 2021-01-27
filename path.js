class Path {
  /* 
  consists of a collection of points
  */

  static NUM_FRAMES_TO_SKIP = 50
  __pathid=0
  constructor(game, ctx, ctxRouteDesign) {
    this.game = game
    this.ctx = ctx
    this.ctxRouteDesign = ctxRouteDesign
    this.number = `${this.__pathid++}. RTN${Math.floor(Math.random() * 1000)}`
    this._finalized = false
    //critical points on the path
    this.points = []

    //way points
    this.wp = []

    this.i = 0
    this.stations = []
    this.numFrames = 0
    this.going = true

    // this._train = new Train(3, 0)
    // this.game.cashflow.enginecost = Game.COST_ENGINE
    // this.game.cashflow.coachcost = 3*Game.COST_PASSENGER_COACH

    this._segments = null
    this.storedTransform = null
    this.PathIdInDB=null
  }
  get rects() {
    return 1 + this.train.num_passenger_coaches + this.train.num_goods_coaches
  }
  get train() {
    return this._train
  }

  addPoint(point) {
    this.points.push(point)
  }
  popPoint() {
    //remove the last point
    console.log(`popPoint() called`)
    this.points.pop()
  }
  get numWaypoints() {
    return this.wp.length
  }
  get pathLength() {
    return this.numWaypoints * Game.WPL
  }
  get finalized() {
    return this._finalized
  }
  set finalized(value) {
    this._finalized = value
    if (value == true) {
      //console.log(`Route ${this.number} finalized and way points being created`)
      this.createSegments()
      this.createWayPoints()
      this.updateStations()
      this.savePathInDB()
      this._train = new Train(3, 0)
      this.game.cashflow.enginecost = Game.COST_ENGINE
      this.game.cashflow.coachcost = 3 * Game.COST_PASSENGER_COACH
    }
  }
  savePathInDB(){
    let json1 = savePathToDB(this.game.gameid,this.number,this._finalized,this.points)
    json1.then(data=>{
      this.PathIdInDB = data[0]
      let json2
      for(let iwp=0;iwp<this.wp.length;iwp++){
        json2 = saveWayPointToDB(this.PathIdInDB,this.wp[iwp].n,this.wp[iwp].x,this.wp[iwp].y,this.wp[iwp].feature)
        json2.then(data=>{
          //console.log(`waypointid : ${data[0]}`)
        }).catch(err=>{
          console.error(`Error in saveWayPointToDB: ${err}`)  
        })
      }
    }).catch(err=>{
      console.error(`Could not get pathIdInDB`)
    })
  }
  get isValid() {
    //first prune the path if necessary
    this.prunePoints()
    //the length of points has to be greater than 1
    return this.length > 1 &&
      distanceToClosestCity(this.game.cities, this.points[0].x, this.points[0].y) < Game.CITY_RADIUS &&
      distanceToClosestCity(this.game.cities, this.points[this.length - 1].x, this.points[this.length - 1].y) < Game.CITY_RADIUS

  }
  getPathLengthOverWater() {
    //for each of the way points check if it is over the water
    //the context for the background is available in this.game.ctx_background
    let length = 0
    for (let iwp = 0; iwp < this.wp.length; iwp++) {
      let wpx = this.wp[iwp].x
      let wpy = this.wp[iwp].y
      let imgData = this.game.ctx_background.getImageData(wpx, wpy, 1, 1)
      if (imgData.data[0] == 77 && imgData.data[1] == 77 & imgData.data[2] == 243) {
        length++
      }
    }
    return length * Game.WPL
  }
  getPathLengthInTunnel() {
    //for each of the way points check if it is over the water
    //the context for the background is available in this.game.ctx_background
    let length = 0
    for (let iwp = 0; iwp < this.wp.length; iwp++) {
      let wpx = this.wp[iwp].x
      let wpy = this.wp[iwp].y
      let imgData = this.game.ctx_background.getImageData(wpx, wpy, 1, 1)
      if (imgData.data[0] == 255 && imgData.data[1] == 255 & imgData.data[2] == 255) {
        length++
      }
    }
    return length * Game.WPL
  }
  get pathCapitalCost() {
    //instead we check the length that is over the water
    let overWater = this.getPathLengthOverWater()
    let inTunnel = this.getPathLengthInTunnel()
    let overLand = this.pathLength - overWater - inTunnel
    //console.log(`Over water: ${overWater}, in tunnel: ${inTunnel}, over land:${overLand}`)
    return Math.floor(overLand * Game.TRACK_COST_PER_UNIT + (overWater + inTunnel) * 20 * Game.TRACK_COST_PER_UNIT)
  }

  updateStations() {
    //first add the starting and ending locations as stations
    if (this.wp.length > 0) {
      this.stations = []
      this.stations.push(new Station(getClosestCity(this.game.cities, this.wp[0].x, this.wp[0].y), 0, this.wp[0].x, this.wp[0].y))
      this.stations.push(new Station(getClosestCity(this.game.cities, this.wp[this.wp.length - 1].x, this.wp[this.wp.length - 1].y), this.wp[this.wp.length - 1].n, this.wp[this.wp.length - 1].x, this.wp[this.wp.length - 1].y))
      this.game.cashflow.stationcost = 2 * Game.COST_STATION
      //automatically add stations at all intermediate points that are in city limits
      for (let ip = 1; ip < this.points.length - 1; ip++) {
        let city = getClosestCityObject(this.game.cities, this.points[ip].x, this.points[ip].y)
        if ('name' in city) {
          this.addStation(city.name, city.x, city.y)
        }
      }
    }
  }
  addStation(name, x, y) {
    //compares x,y with all points in wp array and selects the wp item
    //that is closest to x,y
    let min = 100000
    let n = -1
    for (let i = 0; i < this.wp.length; i++) {
      let l = Math.sqrt((this.wp[i].x - x) * (this.wp[i].x - x) + (this.wp[i].y - y) * (this.wp[i].y - y))
      if (l < min) {
        n = this.wp[i].n
        min = l
      }
    }
    if (n != -1 && !this.atStation(n)) {
      //this.stations.push(new Station(name,n,this.wp[n].x,this.wp[n].y))
      this.stations.push(new Station(name, n, x, y))
      this.game.cashflow.stationcost = Game.COST_STATION
    }
  }
  get length() {
    return this.points.length
  }
  get name() {
    return this.stations.map(s => s.name).join('-')
  }

  get lastTwoPoints() {
    return this.points.slice(-2)
  }

  get lineSegments() {
    return this._segments.lineSegments
  }

  get quadraticSegments() {
    return this._segments.quadraticSegments
    //return this._quadraticSegments
  }

  createSegments() {
    this._segments = new Segments()
    let segment_number = 1
    for (let ip = 0; ip < this.length; ip++) {
      if (ip == 1) {
        //second point
        //create one linear segment only
        if (this.length == 2) {
          //alert(`${segment_number} Linear segment added`)
          this._segments.add(segment_number, true, new LinSeg(segment_number, this.points[0], this.points[1]))
        } else {
          //alert(`${segment_number} Linear segment added`)
          this._segments.add(segment_number, true, this.startingLinSegment(segment_number, this.points[0], this.points[1], Game.MIN_LENGTH))
        }
      } else if (ip > 1) {
        //third point onwards
        //here we add a quadratic segment and a linear segment
        let p0 = this.points[ip - 2], p1 = this.points[ip - 1], p2 = this.points[ip]
        let l1 = Math.pow((p0.x - p1.x) * (p0.x - p1.x) + (p0.y - p1.y) * (p0.y - p1.y), 0.5)
        let xDiff = (p0.x - p1.x)
        let yDiff = (p0.y - p1.y)
        let p1_ = { x: p1.x + xDiff * Game.MIN_LENGTH / l1, y: p1.y + yDiff * Game.MIN_LENGTH / l1 }

        let l2 = Math.pow((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y), 0.5)
        xDiff = (p2.x - p1.x)
        yDiff = (p2.y - p1.y)
        let p2_ = new Point(p1.x + xDiff * Game.MIN_LENGTH / l2, p1.y + yDiff * Game.MIN_LENGTH / l2)

        //this._quadraticSegments.push(new QuadSeg(segment_number++,p1_, p2_, p1))
        //alert(`${segment_number} Quad segment added`)
        this._segments.add(segment_number, false, new QuadSeg(segment_number, p1_, p2_, p1))

        //check if the length of l2 is greater than 2*MIN_LENGTh
        //if it is then a linear segment needs to be added.
        if ((l2 > 2 * Game.MIN_LENGTH && ip < this.length - 1) || (l2 > Game.MIN_LENGTH && ip == this.length - 1)) {
          let endPoint
          if (ip < this.length - 1) { //added on 11/09/20
            //starting point is p2_
            //and ending point is this.game.MIN_LENGTH away from p2
            endPoint = new Point(p2.x + (p1.x - p2.x) * Game.MIN_LENGTH / l2, p2.y + (p1.y - p2.y) * Game.MIN_LENGTH / l2)
            // console.log(`endPoint calculated when ip<this.length-1=${ip},${this.length-1}:${endPoint.x},${endPoint.y}`)
          } else {
            endPoint = this.points[ip]  //added on 11/09/20
            // console.log(`endPoint calculated when ip==this.length-1=${ip},${this.length-1}:${endPoint.x},${endPoint.y}`)
          }//added on 11/09/20
          // alert(`${segment_number} Linear segment added`)
          this._segments.add(segment_number, true, new LinSeg(segment_number, p2_, endPoint))
        } else {
          // console.log(`_lineSegment not added for ip:${ip}`)
        }
      }
    }
  }
  startingLinSegment(segment_number, p1, p2, d) {
    let l = Math.pow((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y), 0.5)
    let px = p1.x + (p2.x - p1.x) * (l - d) / l
    let py = p1.y + (p2.y - p1.y) * (l - d) / l
    return new LinSeg(segment_number, p1, new Point(px, py))
  }

  draw(pathColor) {
    if (!this.finalized) {
      this.createSegments()
    }
    //this._segments.draw(this.ctx, pathColor)
  }
  drawRoute(pathColor) {
    //route is drawn on ctxRouteDesign. It uses the points array
    this.ctxRouteDesign.beginPath()
    for (let i = 0; i < this.points.length - 1; i++) {
      this.ctxRouteDesign.moveTo(this.points[i].x, this.points[i].y)
      this.ctxRouteDesign.lineTo(this.points[i + 1].x, this.points[i + 1].y)
    }
    this.ctxRouteDesign.stroke()
  }
  drawBackground(ctx) {
    //instead of segments drawing the background
    //we use the wp array to connect all the points
    //this._segments.drawBackground(ctx)
    let r, m
    ctx.save()
    for (let i = 0; i < this.wp.length-1; i++) {
      if (i % 3 == 0) {
        
        if (this.wp[i].feature != Game.FEATURE_TUNNEL) {
          //the following works
          // ctx.beginPath()
          // ctx.resetTransform()
          // m = (this.wp[i + 1].y - this.wp[i].y) / (this.wp[i + 1].x - this.wp[i].x)
          // ctx.translate(this.wp[i].x, this.wp[i].y)
          // ctx.rotate(Math.atan(m))
          // if (this.wp[i].feature == Game.FEATURE_LAND) {
          //   ctx.strokeStyle = "rgb(0,0,0)"
          //   ctx.lineWidth = 0.1
          // } else if (this.wp[i].feature == Game.FEATURE_WATER) {
          //   ctx.strokeStyle = "rgb(255,255,0)"
          //   ctx.lineWidth = 1
          // }
          // ctx.moveTo(0, -2)
          // ctx.lineTo(0, 2)
          // ctx.stroke()

          ctx.resetTransform()
          m = (this.wp[i + 1].y - this.wp[i].y) / (this.wp[i + 1].x - this.wp[i].x)
          ctx.translate(this.wp[i].x, this.wp[i].y)
          ctx.rotate(Math.atan(m))
          if (this.wp[i].feature == Game.FEATURE_LAND) {
            ctx.strokeStyle = "rgb(0,0,0)"
            ctx.lineWidth = 0.1
          } else if (this.wp[i].feature == Game.FEATURE_WATER) {
            ctx.strokeStyle = "rgb(0,0,0)"
            ctx.lineWidth = 2
          }
          ctx.translate(0, 2)
          ctx.beginPath()
          ctx.moveTo(-2, 0)
          ctx.lineTo(2, 0)
          ctx.stroke()
          ctx.translate(0, -4)
          ctx.beginPath()
          ctx.moveTo(-2, 0)
          ctx.lineTo(2, 0)
          ctx.stroke()
        }
      }
    }
    ctx.restore()
  }
  atStation(i) {
    let s = this.stations.findIndex(station => station.wpn == this.wp[i].n)
    return s !== -1
  }
  getStation(i) {
    //returns the station object at i
    return this.stations.find(station => station.wpn == this.wp[i].n)
  }
  drawStations(ctx) {
    //this.stations is an array containing indexes into the this.wp[] array
    this.stations.forEach(station => {
      ctx.save()
      ctx.lineWidth = 2
      ctx.strokeStyle = 'red'
      ctx.beginPath()
      ctx.moveTo(station.x + 8, station.y)
      ctx.arc(station.x, station.y, 8, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.restore()
    })
  }
  createWayPoints() {

    //if(this.finalized) return
    //console.log(`Way points being created`)
    let n = 0
    this.wp = []
    let wpl = Game.WPL
    for (let i = 0; i < this._segments.length; i++) {
      if (this._segments.segments[i].lineSegment) {
        //line segments
        let lineSegment = this._segments.segments[i].segment
        let { p1, p2 } = lineSegment
        let d = lineLength(p1.x, p1.y, p2.x, p2.y)
        for (let wp = 0; wp < Math.floor(d / wpl); wp++) {
          let x = p1.x + (p2.x - p1.x) * wp * wpl / d
          let y = p1.y + (p2.y - p1.y) * wp * wpl / d
          let feature = getFeature(this.game.ctx_background, x, y)
          this.wp.push({ n: n++, x, y, feature: feature })
          //console.log(wp,feature)
        }
        let feature = getFeature(this.game.ctx_background, p2.x, p2.y)
        this.wp.push({ n: n++, x: p2.x, y: p2.y, feature: feature })
      } else {
        //line segment before this
        let seg1 = this._segments.segments[i - 1].segment
        //line segment before this
        let seg2 = this._segments.segments[i + 1].segment
        let { p1: p1, p2: p2 } = seg1
        let { p1: p3, p2: p4 } = seg2
        let { x, y, radius } = circle(p1, p2, p3, p4)
        //console.log(`Seg: ${i},${x},${y},${radius}`)

        let finalpoints = pointsAlongArcNew(x, y, radius, p2.x, p2.y, p3.x, p3.y, this.ctx)
        for (let i = 0; i < finalpoints.length; i++) {
          let feature = getFeature(this.game.ctx_background, x, y)
          this.wp.push({ n: n++, x: finalpoints[i].x, y: finalpoints[i].y, feature: feature })
          //console.log(`Along Curve:${n}, ${finalpoints[i].x},${finalpoints[i].y}`)
        }
      }
    }
  }
  animate(canvas, ctx) {
    let p1, p3
    let event
    let ptgap = 6 - Game.WPL
    for (let iRect = 0; iRect < this.rects; iRect++) {
      //let ptAdjust = iRect * Path.PTGAP;
      let ptAdjust = iRect * ptgap
      p1 = this.wp[this.i - ptAdjust];
      p3 = this.wp[this.i + 1 - ptAdjust];
      let rad
      let w = ((iRect === 0 && this.going) || (iRect == this.rects - 1 && !this.going)) ? 9 : 7
      let h = ((iRect === 0 && this.going) || (iRect == this.rects - 1 && !this.going)) ? 4 : 4
      if ((this.i - ptAdjust > -1) && p1.feature != Game.FEATURE_TUNNEL) {
        if (p3) {
          rad = Math.atan((p3.y - p1.y) / (p3.x - p1.x));
        }
        ctx.save();
        if ((iRect === 0 && this.going) || (iRect == this.rects - 1 && !this.going)) {
          ctx.fillStyle = "rgba(100,100,100)";
        } else {
          ctx.fillStyle = `rgba(255,0,0,${this.train.occupancy + 0.2})`;
        }
        ctx.translate(p1.x, p1.y);
        ctx.rotate(rad);
        ctx.translate(-Math.floor(w / 2), - Math.floor(h / 2));
        ctx.fillRect(0, 0, w, h);
        if ((iRect === 0 && this.going) || (iRect == this.rects - 1 && !this.going)) {
          let smokestack
          // if(iRect === 0){
          //   smokestack=this.going?w-10:w-10
          // }else{
          //   smokestack=!this.going?w-2:w-2 
          // }
          smokestack = iRect === 0 ? w / 2 : w / 2
          if (this.i % 2 == 0) {

            //smoke
            ctx.beginPath()
            ctx.moveTo(smokestack, 0)
            ctx.arc(smokestack, 2, 1, 0, 2 * Math.PI)
            ctx.fillStyle = 'rgba(212,212,212,0.7)'
            ctx.fill()
            this.storedTransform = ctx.getTransform()
          } else if (this.i % 2 == 1) {

            //smoke
            // ctx.beginPath()
            // ctx.moveTo(smokestack,0)
            // ctx.arc(smokestack,2,4,0,2*Math.PI)
            // ctx.fillStyle='rgba(180,180,180,0.5)'
            // ctx.fill()
            ctx.setTransform(this.storedTransform)
            ctx.beginPath()
            ctx.arc(smokestack, 2, 2, 0, 2 * Math.PI)
            ctx.fillStyle = 'rgba(180,180,180,0.4)'
            ctx.fill()

          }

        }
        ctx.restore();
      }
    }

    //train not at station or atStation and time to move on
    if (!this.atStation(this.i) || (this.atStation(this.i) && this.numFrames > Path.NUM_FRAMES_TO_SKIP)) {
      //start movement .. this is accomplished by advancing this.i
      this.i = this.going ? this.i + 1 : this.i - 1
      if (this.i == this.wp.length) {
        this.i = this.wp.length - 1
        this.going = false
      } else if (this.i == -1) {
        this.i = 0
        this.going = true
      }
      //reset timer
      this.numFrames = 0
      //train at station but not time to move on
      //audiochugging=null
    } else if ((this.atStation(this.i) && this.numFrames <= Path.NUM_FRAMES_TO_SKIP)) {
      if (this.game.makeSound) {
        if (this.numFrames == Path.NUM_FRAMES_TO_SKIP - 10) {
          let currCity_wpn = this.getStation(this.i).wpn
          if (currCity_wpn == 0 && this.going || currCity_wpn == this.wp.length - 1 && !this.going) {
            this.game.audiowhistle.play()
            play(this.game.audiochugging, 15000)
          }
        }
      }
      if (this.numFrames == 0) {
        //console.log(`Train reached station at location: ${this.i}, ${this.going}`)

        let currCity = this.getStation(this.i).name
        let currCity_wpn = this.getStation(this.i).wpn
        let totalfare=0

        //first alight the passengers for this city
        if (currCity_wpn == 0 && this.going || currCity_wpn == this.wp.length - 1 && !this.going) {
          //starting point on going or returning back. No one is alighted here as that was done
          //already when the train was at this point coming into this station
        } else {
          let numAlighted = this.train.alightPassengersForCity(currCity)
        }
        //console.log(`Alighted ${numAlighted} at ${currCity}`)
        let numNoRoom = 0
        if (this.going) {
          //take in passengers for the cities on the way back to the final station

          //other stations that are in the direction of the final
          //destination all have their wpns that are greater than currCity_wpn
          this.stations.forEach(station => {
            if (station.wpn > currCity_wpn) {
              let num = Math.floor(this.game.passengers.numAvailable(currCity, station.name))
              //second check the room
              let room = this.train.passenger_room_available
              numNoRoom += (num>=room?num-room:0)
              num = Math.min(num, room)
              //collect fare
              let fare = this.game.tickets.ticket(currCity, station.name)
              if (this.game.makeSound && Math.floor(num * fare / 1000) >= Game.FARE_FOR_AUDIO) {
                event = new CustomEvent("money", {
                  detail: {
                    train: this.name,
                    fare: Math.floor(num * fare / 1000)
                  }
                });
                document.dispatchEvent(event)
              }
              event = new CustomEvent("info", {
                detail: {
                  train: this.name,
                  text: `${num} P, ${currCity.substring(0, 3)}-${station.name.substring(0, 3)} @ ${fare} = ${Math.ceil(num * fare / 1000)} K`
                }
              });
              document.dispatchEvent(event);
              this.game.cashflow.ticketsales = num * fare
              totalfare += num * fare
              //console.log(`Ticket Sales after: ${this.game.cashflow.ticketsales}`)
              //third board the passengers
              this.train.boardPassengersFor(station.name, num)
              //reduce the number of passengers that have boarded
              this.game.passengers.subtractPassengers(currCity, station.name, num)
            }
          })
          
        } else {
          //take in passengers for the cities on the way back to the originating station
          this.stations.forEach(station => {
            if (station.wpn < currCity_wpn) {
              let num = Math.ceil(this.game.passengers.numAvailable(currCity, station.name))
              //second check the room
              let room = this.train.passenger_room_available
              numNoRoom += (num>=room?num-room:0)
              num = Math.min(num, room)
              //collect fare
              let fare = this.game.tickets.ticket(currCity, station.name)
              if (this.game.makeSound && Math.floor(num * fare / 1000) >= Game.FARE_FOR_AUDIO) {
                event = new CustomEvent("money", {
                  detail: {
                    train: this.name,
                    fare: Math.floor(num * fare / 1000)
                  }
                });
                document.dispatchEvent(event)
              }
              event = new CustomEvent("info", {
                detail: {
                  train: this.name,
                  text: `${num} P, ${currCity.substring(0, 3)}-${station.name.substring(0, 3)} @ ${fare} = ${Math.floor(num * fare / 1000)} K`
                }
              });
              document.dispatchEvent(event);
              this.game.cashflow.ticketsales = num * fare
              totalfare += num * fare
              //console.log(`Ticket Sales after: ${this.game.cashflow.ticketsales}`)
              //third board the passengers
              this.train.boardPassengersFor(station.name, num)
              //reduce the number of passengers that have boarded
              this.game.passengers.subtractPassengers(currCity, station.name, num)
            }
          })
          this.numFrames++
        }
        
        let popup = document.querySelector(`#${currCity}-popup`)
        popup.classList.toggle('active');
        popup.innerHTML = `$${Math.ceil(totalfare / 1000)} K`
        let popup2 = document.querySelector(`#${currCity}-popup2`)
        popup2.style.left = popup.style.left + 40
        popup2.top = popup.top
        popup2.innerHTML = `&#x2639 ${numNoRoom}`
        popup2.classList.toggle('active2');
      }
      this.numFrames++
      //audiochugging=null
    }

  }

  alreadySelected(x, y) {
    return (
      //changed this to make explicit the logic by placing additional brackets
      this.wp.findIndex(p => (Math.abs(p.x - x) < 2) && (Math.abs(p.y - y) < 2)) !== -1
    );
  }

  savePeriodDataToDB(gameperiodid) {
    console.log(`gameperiod id:${gameperiodid},path id:${this.PathIdInDB},number:${this.number} ,numFrames:${this.numFrames}, going:${this.going}, ${this.train.num_passenger_coaches}, ${this.train.num_goods_coaches} saving to db.`)
    let json = savePeriodPathToDB(gameperiodid,this.PathIdInDB,this.i,this.numFrames,this.going,this.train.num_passenger_coaches,this.train.num_goods_coaches)
    json.then(data=>{
      let pathperiodid = data[0]
      console.log(`pathperiodid returned from db: ${pathperiodid}`)
      savePassengersOnTrainToDB(pathperiodid,this.train.passengers)
    }).catch(err=>{
      console.error(`Error in saving data in savePassengersOnTrainToDB`)
    })
    //we should get the pathperiodid since we have to use that to save the
    //passenger data
  }
  prunePoints(){
    //sometimes a user creates a path that does not end in a city. prunePoints removes
    //points from the end of the points array till it finds a point that is a city.
    for(let i = this.points.length-1; i != 0; i--){
      if(this.game.cities.cities.some(city=>city.x==this.points[i].x && city.y==this.points[i].y)){
        return
      }else{
        let removedPoint = this.points.pop()
        console.log(`Pruned the point ${JSON.stringify(removedPoint)} from the path`)
      }
    }
  }
  
}