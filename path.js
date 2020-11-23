class Path {
  /* 
  consists of a collection of points
  */

  //this is extremely important. Decides how big the
  //range is for checking neighbors
  static D = 3;
  static WPL = 3;

  constructor(ctx) {
    this.name=`RTN${Math.floor(Math.random()*1000)}` 
    this.ctx = ctx
    this._finalized=false
    //critical points on the path
    this.points = new Array()

    //way points
    this.wp = []

    this.i = 0
    this.ptGap = 4
    this.approxStationLocations = new Array()
    this.stations = new Array()
    this.numFrames = 0
    this.numFramesToSkip = 100
    this.going = true
    this.train = new Train(2,0,0)
    this._lineSegments = null
    this._quadraticSegments = null
    this._segments = null
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
    if(this.wp.length>0){
      this.stations.push(new Station(getClosestCity(this.wp[0].x,this.wp[0].y),0,this.wp[0].x,this.wp[0].y))
      this.stations.push(new Station(getClosestCity(this.wp[this.wp.length-1].x,this.wp[this.wp.length-1].y),this.wp[this.wp.length-1].n,this.wp[this.wp.length-1].x,this.wp[this.wp.length-1].y))
      this.approxStationLocations.forEach(l=>{
        this.addStation(l.x,l.y)
      })
    }
  }
  addStation(x, y) {
    console.log(`adding station at ${x},${y}`)
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
    //if (n != -1 && !this.stations.includes(n)) {
    if (n != -1 && !this.atStation(i)) {
    this.stations.push(new Station(getClosestCity(this.wp[n].x,this.wp[n].y),n,this.wp[n].x,this.wp[n].y))
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
    return this._segments.lineSegments
    //return this._lineSegments
  }
  get quadraticSegments() {
    return this._segments.quadraticSegments
    //return this._quadraticSegments
  }
  createSegments() {
    this._lineSegments = new Array()
    this._quadraticSegments = new Array()
    this._segments = new Segments()
    let segment_number=1
    for (let ip = 0; ip < this.length; ip++) {
      if (ip == 1) {
        //second point
        //create one linear segment only
        if (this.length == 2) {
          this._lineSegments.push(new LinSeg(segment_number++,this.points[0], this.points[1]))
          this._segments.add(segment_number,true,new LinSeg(segment_number,this.points[0], this.points[1]))
        } else {
          this._lineSegments.push(this.startingLinSegment(segment_number++,this.points[0], this.points[1], MIN_LENGTH))
          this._segments.add(segment_number,true,this.startingLinSegment(segment_number,this.points[0], this.points[1], MIN_LENGTH))
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

        this._quadraticSegments.push(new QuadSeg(segment_number++,p1_, p2_, p1))
        this._segments.add(segment_number,false,new QuadSeg(segment_number,p1_, p2_, p1))

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
          this._lineSegments.push(new LinSeg(segment_number++,p2_, endPoint))
          this._segments.add(segment_number,true,new LinSeg(segment_number,p2_, endPoint))
        }else{
          console.log(`_lineSegment not added for ip:${ip}`)
        }
      }
    }
  }
  startingLinSegment(segment_number,p1, p2, d) {
    let l = Math.pow((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y), 0.5)
    let px = p1.x + (p2.x - p1.x) * (l - d) / l
    let py = p1.y + (p2.y - p1.y) * (l - d) / l
    return new LinSeg(segment_number,p1, new Point(px, py))
  }
  endingLinSegment(segment_number,p1, p2, d) {
    let l = Math.pow((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y), 0.5)
    let px = p1.x + (p2.x - p1.x) * d / l
    let py = p1.y + (p2.y - p1.y) * d / l
    return new LinSeg(segment_number,new Point(px, py), p2)
  }
  draw(pathColor) {
    this.createSegments()
    try {
      this._lineSegments.forEach(l => {
        l.draw(this.ctx,pathColor)
        console.log(`line segment drawn: ${JSON.stringify(l)}`)
      })
    } catch (error) {
      console.error('error: ' + error)
    }
    try {
      this._quadraticSegments.forEach(l => {
        l.draw(this.ctx,pathColor)
        console.log(`quad segment drawn: ${JSON.stringify(l)}`)
      })
    } catch (error) {
      console.error('error: ' + error)
    }
    //this._segments.draw(this.ctx, pathColor)
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
    this._segments.drawBackground(ctx)
  }
  atStation(i){
    let s = this.stations.findIndex(station=>station.wpn == this.wp[i].n)
    return s !== -1
  }
  getStation(i){
    //returns the station object at i
    return this.stations.find(station=>station.wpn == this.wp[i].n)
  }
  drawStations(ctx){
    //this.stations is an array containing indexes into the this.wp[] array
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
  createWayPoints(){

    //first create segments
    this.createSegments()

    //this replaces scanNeighbors
    let n = 0
    this.wp=[]
    let wpl=Path.WPL
    for(let i=0;i<this._segments.length;i++){
      console.log(`this._segments.segments[${i}].lineSegment: ${this._segments.segments[i].lineSegment}`)
      if(this._segments.segments[i].lineSegment){
        //line segments
        let lineSegment = this._segments.segments[i].segment
        let {p1,p2}=lineSegment
        let d = lineLength(p1.x,p1.y,p2.x,p2.y)
        for(let wp=0;wp<Math.floor(d/wpl);wp++){
          let x = p1.x+(p2.x-p1.x)*wp*wpl/d
          let y = p1.y+(p2.y-p1.y)*wp*wpl/d
          this.wp.push({n:n++,x,y})
        }
        this.wp.push({n:n++,x:p2.x,y:p2.y})
      }else{
        //quad segments, now circular segments
        let quadSegment = this._segments.segments[i].segment
        //line segment before this
        let seg1 = this._segments.segments[i-1].segment
        //line segment before this
        let seg2 = this._segments.segments[i+1].segment
        let {p1:p1,p2:p2}=seg1
        let {p1:p3,p2:p4}=seg2
        let {x,y,radius} = circle(p1,p2,p3,p4)
        console.log(`Seg: ${i},${x},${y},${radius}`)

        let finalpoints = pointsAlongArc(x,y,radius,p2.x,p2.y,p3.x,p3.y)
        console.log(`Final points: ${finalpoints}`)
        for(let i=0;i<finalpoints.length;i++){
          this.wp.push({n:n++,x:finalpoints[i].x,y:finalpoints[i].y})
        }
      }
    }
  }
  animate(canvas, ctx) {
    let p1, p3
    for (let iRect = 0; iRect < this.rects; iRect++) {
      let ptAdjust = iRect * this.ptGap;
      p1 = this.wp[this.i - ptAdjust];
      p3 = this.wp[this.i + 1 - ptAdjust];
      let rad
      let w = ((iRect === 0 && this.going) || (iRect == this.rects - 1 && !this.going)) ? 12 : 10
      let h = ((iRect === 0 && this.going) || (iRect == this.rects - 1 && !this.going)) ? 4 : 4
      if (this.i - ptAdjust > -1) {
        if (p3) {
          rad = Math.atan((p3.y - p1.y) / (p3.x - p1.x));
        }
        ctx.save();
        if ((iRect === 0 && this.going) || (iRect == this.rects - 1 && !this.going)) {
          ctx.fillStyle = "rgba(100,100,100)";
        } else {
          ctx.fillStyle = `rgba(255,0,0,${this.train.occupancy+0.2})`;
        }
        ctx.translate(p1.x , p1.y);
        ctx.rotate(rad);
        ctx.translate(-Math.floor(w / 2), - Math.floor(h / 2));
        ctx.fillRect(0, 0, w, h);
        //ctx.translate(p1.x + Math.floor(w / 2), p1.y + Math.floor(h / 2));
        // ctx.translate(-(p1.x + Math.floor(w / 2)), -(p1.y + Math.floor(h / 2)));
        // ctx.translate(-(p1.x), -(p1.y));
        // ctx.fillRect(p1.x, p1.y, w, h);
        ctx.restore();
      }
    }

    //train not at station or atStation and time to move on
    if(!this.atStation(this.i) || (this.atStation(this.i) && this.numFrames > this.numFramesToSkip)){
      //start movement .. this is accomplished by advancing this.i
      this.i=this.going?this.i+1:this.i-1
      if (this.i == this.wp.length) {
        this.i = this.wp.length - 1
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
        let currCity_wpn = this.getStation(this.i).wpn
        //first alight the passengers for this city
        let numAlighted = this.train.alightPassengersForCity(currCity)
        console.log(`Alighted ${numAlighted} at ${currCity}`)
        if(this.going){
          //take in passengers for the cities on the way back to the final station
          
          //other stations that are in the direction of the final
          //destination all have their wpns that are greater than currCity_wpn
          this.stations.forEach(station=>{
            if(station.wpn>currCity_wpn){
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
            if(station.wpn<currCity_wpn){
              let num = passengers.numAvailable(currCity,station.name)
              //second check the room
              let room = this.train.passenger_room_available
              num = Math.min(num,room)
              console.log(`Take ${num} passengers from ${currCity} to ${station.name}`)
              //third board the passengers
              this.train.boardPassengersFor(station.name,num)
            }
          })
          this.numFrames++   
        }

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
}