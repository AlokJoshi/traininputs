class Path {
  /* 
  consists of a collection of points
  */
  constructor(ctx) {
    this.name=`RTN${Math.floor(Math.random()*1000)}` 
    this.ctx = ctx
    this._finalized=false
    //critical points on the path
    this.points = new Array()
    //detailed points making up the path
    this.dp = new Array()
    //this.rects = 5
    this.i = 0
    this.ptGap = 6
    this.approxStationLocations = new Array()
    this.stations = new Array()
    this.numFrames = 0
    this.numFramesToSkip = 100
    this.going = true
    this.train = new Train(1,0,0)
  }
  get rects(){
    return 1+this.train.num_passenger_coaches+this.train.num_goods_coaches
  }
  
  
  addPoint(point) {
    this.points.push(point)
  }
  popPoint() {
    //remove the last point
    console.log(`popPoint() called`)
    this.points.pop()
  }
  get pathLength(){
    let pl = 0
    this.lineSegments.forEach(s=>{
      console.log(`lineseg:${s.length}`)
      pl+=s.length
    })
    this.quadraticSegments.forEach(s=>{
      console.log(`QuadSeg:${s.length}`)
      pl+=s.length
    })
    return pl
  }
  get finalized(){
    return this._finalized
  }
  set finalized(value){
    this._finalized=value 
  }
  get pathCapitalCost(){
    return Math.floor(this.pathLength*1000)
  }
  addApproxStationLocation(x,y){
    this.approxStationLocations.push({x:x,y:y})
  }
  updateStations(){
    //first add the starting and ending locations as stations
    this.stations.push(new Station(getClosestCity(this.dp[0].x,this.dp[0].y),0,this.dp[0].x,this.dp[0].y))
    this.stations.push(new Station(getClosestCity(this.dp[this.dp.length-1].x,this.dp[this.dp.length-1].y),this.dp[this.dp.length-1].n,this.dp[this.dp.length-1].x,this.dp[this.dp.length-1].y))
    //this.addStation(this.dp[this.dp.length-1].x,this.dp[this.dp.length-1].y)
    this.approxStationLocations.forEach(l=>{
      this.addStation(l.x,l.y)
    })
  }
  addStation(x, y) {
    console.log(`adding station at ${x},${y}`)
    //compares x,y with all points in dp array and selects the dp item
    //that is closest to x,y
    let min = 100000
    let n = -1
    for (let i = 0; i < this.dp.length; i++) {
      let l = Math.sqrt((this.dp[i].x - x) * (this.dp[i].x - x) + (this.dp[i].y - y) * (this.dp[i].y - y))
      if (l < min) {
        n = this.dp[i].n
        min = l
      }
    }
    //if (n != -1 && !this.stations.includes(n)) {
    if (n != -1 && !this.atStation(i)) {
    this.stations.push(new Station(getClosestCity(this.dp[n].x,this.dp[n].y),n,this.dp[n].x,this.dp[n].y))
    //this.stations.push(n)
    }
  }
  get length() {
    return this.points.length
  }
  get lastTwoPoints() {
    return this.points.slice(-2)
  }
  get lineSegments() {
    return this._lineSegments
  }
  get quadraticSegments() {
    return this._quadraticSegments
  }
  createSegments() {
    this._lineSegments = new Array()
    this._quadraticSegments = new Array()
    for (let ip = 0; ip < this.length; ip++) {
      if (ip == 1) {
        //second point
        //create one linear segment only
        if (this.length == 2) {
          this._lineSegments.push(new LinSeg(this.points[0], this.points[1]))
        } else {
          this._lineSegments.push(this.startingLinSegment(this.points[0], this.points[1], MIN_LENGTH))
        }
      } else if (ip > 1) {
        //third point onwards
        //here we add a quadratic segment and a linear segment
        let p0 = this.points[ip - 2], p1 = this.points[ip - 1], p2 = this.points[ip]
        let l1 = Math.pow((p0.x - p1.x) * (p0.x - p1.x) + (p0.y - p1.y) * (p0.y - p1.y), 0.5)
        let xDiff = (p0.x - p1.x)
        let yDiff = (p0.y - p1.y)
        let p1_ = { x: p1.x + xDiff * MIN_LENGTH / l1, y: p1.y + yDiff * MIN_LENGTH / l1 }

        let l2 = Math.pow((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y), 0.5)
        xDiff = (p2.x - p1.x)
        yDiff = (p2.y - p1.y)
        let p2_ = new Point(p1.x + xDiff * MIN_LENGTH / l2, p1.y + yDiff * MIN_LENGTH / l2)

        this._quadraticSegments.push(new QuadSeg(p1_, p2_, p1))

        //check if the length of l2 is greater than 2*MIN_LENGTh
        //if it is then a linear segment needs to be added.
        if ((l2 > 2 * MIN_LENGTH && ip<this.length-1) || (l2>MIN_LENGTH && ip==this.length-1)) {
          let endPoint
          if(ip<this.length-1){ //added on 11/09/20
            //starting point is p2_
            //and ending point is MIN_LENGTH away from p2
            endPoint = new Point(p2.x + (p1.x - p2.x) * MIN_LENGTH / l2, p2.y + (p1.y - p2.y) * MIN_LENGTH / l2)
            console.log(`endPoint calculated when ip<this.length-1=${ip},${this.length-1}:${endPoint.x},${endPoint.y}`)
          }else{
            endPoint = this.points[ip]  //added on 11/09/20
            console.log(`endPoint calculated when ip==this.length-1=${ip},${this.length-1}:${endPoint.x},${endPoint.y}`)
          }//added on 11/09/20
          this._lineSegments.push(new LinSeg(p2_, endPoint))
        }else{
          console.log(`_lineSegment not added for ip:${ip}`)
        }
      }
      //removed on 11/09/20 if it is the last point we need to add the straight segment
      // if (ip > 1 && ip == this.length - 1) {
      //   this._lineSegments.push(this.endingLinSegment(this.points[ip - 1], this.points[ip], MIN_LENGTH))
      // }
    }
  }
  startingLinSegment(p1, p2, d) {
    let l = Math.pow((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y), 0.5)
    let px = p1.x + (p2.x - p1.x) * (l - d) / l
    let py = p1.y + (p2.y - p1.y) * (l - d) / l
    return new LinSeg(p1, new Point(px, py))
  }
  endingLinSegment(p1, p2, d) {
    let l = Math.pow((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y), 0.5)
    let px = p1.x + (p2.x - p1.x) * d / l
    let py = p1.y + (p2.y - p1.y) * d / l
    return new LinSeg(new Point(px, py), p2)
  }
  draw(pathEditMode) {
    this.createSegments()
    try {
      this._lineSegments.forEach(l => l.draw(this.ctx, pathEditMode))
    } catch (error) {
      console.error('error: ' + error)
    }
    try {
      this._quadraticSegments.forEach(l => l.draw(this.ctx, pathEditMode))
    } catch (error) {
      console.error('error: ' + error)
    }

  }
  drawBackground(ctx) {
    try {
      this._lineSegments.forEach(l => l.drawBackground(ctx))
      //console.log(`drawBackground on linSeg called for ${JSON.stringify(l)}` )
    } catch (error) {
      console.log('error: ' + error)
    }
    try {
      this._quadraticSegments.forEach(l => l.drawBackground(ctx))
      //console.log(`drawBackground on linSeg called for ${JSON.stringify(l)}` )
    } catch (error) {
      console.log('error: ' + error)
    }
  }
  atStation(i){
    //return this.stations.includes(this.dp[i].n) 
    let s = this.stations.find(station=>station.dpn == this.dp[i].n)
    return s != undefined
  }
  getStation(i){
    //returns the station object at i
    return this.stations.find(station=>station.dpn == this.dp[i].n)
  }
  drawStations(ctx){
    //this.stations is an array containing indexes into the this.dp[] array
    this.stations.forEach(station=>{
      ctx.save()
      ctx.lineWidth = 2
      ctx.strokeStyle = 'red'
      ctx.beginPath()
      ctx.moveTo(station.x+8,station.y)
      ctx.arc(station.x,station.y,8,0,2*Math.PI)
      ctx.stroke()
      ctx.restore()
    })  
  }
  animate(canvas, ctx) {
    let p1, p3, p4
    for (let iRect = 0; iRect < this.rects; iRect++) {
      let ptAdjust = iRect * this.ptGap;
      p1 = this.dp[this.i - ptAdjust];
      p3 = this.dp[this.i + 2 - ptAdjust];
      p4 = this.dp[this.i + 3 - ptAdjust];
      let rad,rad1,rad2;
      let w = ((iRect === 0 && this.going) || (iRect == this.rects - 1 && !this.going)) ? 12 : 10
      let h = ((iRect === 0 && this.going) || (iRect == this.rects - 1 && !this.going)) ? 6 : 4
      if (this.i - ptAdjust > -1) {
        if (p3 && p4) {
          //rad = Math.atan(((p3.y+p4.y)/2 - p1.y) / ((p3.x+p4.x)/2 - p1.x));
          rad1 = Math.atan((p3.y - p1.y) / (p3.x - p1.x));
          rad2 = Math.atan((p4.y - p1.y) / (p4.x - p1.x));
          rad = (rad1+rad2)/2
        }
        ctx.save();
        if ((iRect === 0 && this.going) || (iRect == this.rects - 1 && !this.going)) {
          ctx.fillStyle = "rgba(100,100,100)";
        } else {
          ctx.fillStyle = `rgba(255,0,0,${this.train.occupancy+0.2})`;
        }
        ctx.translate(p1.x + Math.floor(w / 2), p1.y + Math.floor(h / 2));
        ctx.rotate(rad);
        ctx.translate(-(p1.x + Math.floor(w / 2)), -(p1.y + Math.floor(h / 2)));
        ctx.fillRect(p1.x, p1.y, w, h);
        ctx.restore();
      }
    }

    //train not at station or atStation and time to move on
    if(!this.atStation(this.i) || (this.atStation(this.i) && this.numFrames > this.numFramesToSkip)){
      //start movement .. this is accomplished by advancing this.i
      this.i=this.going?this.i+1:this.i-1
      if (this.i == this.dp.length) {
        this.i = this.dp.length - 1
        this.going = false
        if(makeSound) audiowhistle.play()
      } else if (this.i == -1) {
        this.i = 0
        this.going = true
        if(makeSound) audiowhistle.play()
      }
      //reset timer
      this.numFrames=0
      //train at station but not time to move on
      //audiochugging=null
    }else if((this.atStation(this.i) && this.numFrames <= this.numFramesToSkip)){
      if(this.numFrames==0){
        console.log(`Train reached station at location: ${this.i}, ${this.going}`)
        
        let currCity = this.getStation(this.i).name 
        let currCity_dpn = this.getStation(this.i).dpn
        //first alight the passengers for this city
        let numAlighted = this.train.alightPassengersForCity(currCity)
        console.log(`Alighted ${numAlighted} at ${currCity}`)
        if(this.going){
          //take in passengers for the cities on the way back to the final station
          
          //other stations that are in the direction of the final
          //destination all have their dpns that are greater than currCity_dpn
          this.stations.forEach(station=>{
            if(station.dpn>currCity_dpn){
              let num = passengers.numAvailable(currCity,station.name)
              //second check the room
              let room = this.train.passenger_room_available
              num = Math.min(num,room)
              console.log(`Take ${num} passengers from ${currCity} to ${station.name}`)
              //third board the passengers
              this.train.boardPassengersFor(station.name,num)
            }
          })
        }else{
          //take in passengers for the cities on the way back to the originating station
          this.stations.forEach(station=>{
            if(station.dpn<currCity_dpn){
              let num = passengers.numAvailable(currCity,station.name)
              //second check the room
              let room = this.train.passenger_room_available
              num = Math.min(num,room)
              console.log(`Take ${num} passengers from ${currCity} to ${station.name}`)
              //third board the passengers
              this.train.boardPassengersFor(station.name,num)
            }
          })

        }

      }
      //audiochugging=null
      this.numFrames++    
    }
    
  }

  updateNeighbors() {
    if (this.points.length > 1) {
      this.scanNeighbors(this.ctx, 0, this.points[0].x, this.points[0].y, this.points[this.points.length - 1].x, this.points[this.points.length - 1].y)
      let index = this.dp.findIndex(i=>i.lastpoint==true)
      this.dp.length = index + 1
    }
  }

  scanNeighbors(ctx, n, x, y, endx, endy) {
    //given the x and y of a pixel
    //this function searches the neighborhood and recursively
    //calls the same function if a neighbor is found

    //get image data of the neighboring pixels
    let data = ctx.getImageData(x - D, y - D, 2 * D + 1, 2 * D + 1).data;
    let found = false;
    let xFound, yFound
    //console.log(data.length);
    for (let x_ = -D; x_ < D + 1; x_++) {
      for (let y_ = -D; y_ < D + 1; y_++) {
        if (x_ == -D || x_ == D || y_ == -D || y_ == D) {
          i = ((y_ + D) * (2 * D + 1) + x_ + D) * 4;
          //console.log(data[i], data[i + 1], data[i + 2], data[i + 3]);
          if (
            data[i] === 0 &&
            data[i + 1] === 0 &&
            data[i + 2] === 255 &&
            data[i + 3] >= 13
          ) {
            xFound = x + x_;
            yFound = y + y_;
            if (Math.abs(xFound - endx) < 4 && Math.abs(yFound - endy) < 4) {
              this.dp.push({ n: n, x: endx, y: endy, lastpoint:true });
              return;
            }
            if (!this.alreadySelected(xFound, yFound)) {
              // console.log(`Pushed: ${xFound}, ${yFound}`);
              //push the item into a points array
              this.dp.push({ n: n, x: xFound, y: yFound, lastpoint:false });
              //and call this function recursively
              found = true;
              this.scanNeighbors(ctx, n + 1, xFound, yFound, endx, endy);
            }
          }
        }
      }
    }
    if (!found) return;
  }

  alreadySelected(x, y) {
    return (
      //changed this to make explicit the logic by placing additional brackets
      this.dp.findIndex(p => (Math.abs(p.x - x) < 2) && (Math.abs(p.y - y) < 2)) !== -1
      //this.dp.findIndex(p => Math.abs(p.x - x) < 2 && Math.abs(p.y - y) < 2) !== -1
    );
  }
}