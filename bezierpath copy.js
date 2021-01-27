class BezierPath extends Bezier{
  constructor(x1, y1, x2, y2, fromx, fromy, tox, toy, ctx_background, ctx_foreground,speed) {
    super(x1,y1,x2,y2)

    //Since the trains start from the center of the town, we find a point along 
    //the perpendicular to the line connecting the two points and then a point
    //that is 10 pixels away from the center
    let offset = 10
    let perp_slope = -1/((toy-fromy)/(tox-fromx))
    let theta = Math.atan(perp_slope)
    fromx += offset * Math.cos(theta)
    fromy += offset * Math.sin(theta)
    tox += offset * Math.cos(theta)
    toy += offset * Math.sin(theta)

    // this.x1 = x1
    // this.y1 = y1
    // this.x2 = x2
    // this.y2 = y2
    this.fromx = fromx
    this.fromy = fromy
    this.tox = tox
    this.toy = toy
    this.ctx_b = ctx_background
    this.ctx_f = ctx_foreground
    this.speed = speed

    //going from from to to
    this.i = 0

    //for every stepsize steps i or j moves by 1
    this.stepi = 0
    this.stepj = 0

    this.img = document.getElementById('carimage')
    this.stepsize = 11-speed
    this.prevxi = 0, this.prevyi = 0
    this.prevxj = 0, this.prevyj = 0
    this.waypoints = []
    // let getBezier = bezier(x1, y1, x2, y2);
    // this.getBezier = getBezier
    let b_arr = [],
      x,
      y,
      nexti = 0;
    let rangex = range(fromx, tox, fromx < tox ? 1 : -1)
    rangex.forEach(x => {
      //normalize the x to a value between 0 and 1
      //get bezier function has to be passed a fraction between 0 and 1
      let val = (x - fromx) / (tox - fromx)
      let progress = this.getBezier(val);
      //the value returned(progress) is a fraction between 0 and 1
      console.assert(progress >= 0 && progress <= 1, `progress(${progress}) is not between 0 and 1`)
      let y = fromy + progress * (toy - fromy)
      b_arr.push({ x: x, y: y });
    })

    //let d be the length of the segment
    const d = 1;
    //create a new array that has x and y points along the bezier curve such
    //that each point is d distance from the neighbor
    nexti = 0;
    let startx, starty;
    startx = b_arr[0].x;
    starty = b_arr[0].y;
    this.waypoints.push({ x: startx, y: starty });
    do {
      nexti++;
      //console.log(`nexti: ${nexti}`);
      //length between startx,starty and the point on the bezier curve(b_arr)
      let l = Math.sqrt(
        (startx - b_arr[nexti].x) * (startx - b_arr[nexti].x) +
        (starty - b_arr[nexti].y) * (starty - b_arr[nexti].y)
      );
      if (l > d) {
        //console.log(`element at ${nexti} being added`);
        startx = b_arr[nexti].x;
        starty = b_arr[nexti].y;
        this.waypoints.push({ x: startx, y: starty });
      } else {
        //console.log(`l:${l} is less than d:${d}`);
      }
    } while (nexti < b_arr.length - 1);

    //returning going from to to from
    this.j = this.waypoints.length - 1
  }
  animate() {
    this._animateGoing()
    this._animateReturning()
  }
  _animateGoing() {
    let x, y, slope
    if (this.i < this.waypoints.length - 2) {
      let next_wp = this.waypoints[this.i + 1]
      let curr_wp = this.waypoints[this.i]
      x = curr_wp.x + (next_wp.x - curr_wp.x) * this.stepi / this.stepsize
      y = curr_wp.y + (next_wp.y - curr_wp.y) * this.stepi / this.stepsize
    }
    slope = (y - this.prevyi) / (x - this.prevxi)
    let dispy = -this.img.height/2
    let dispx = -this.img.width/2
    this.ctx_f.save()
    this.ctx_f.translate(x , y )
    this.ctx_f.rotate(Math.PI / 2 + Math.atan(slope))
    this.ctx_f.drawImage(this.img, 0, 0, this.img.width, this.img.height, dispx, dispy, this.img.width, this.img.height)
    this.stepi++
    if (this.stepi >= this.stepsize) {
      this.i++
      this.stepi = 0
      if (this.i > this.waypoints.length - 1) {
        this.i = 0
      }
    }
    this.ctx_f.restore()
    this.prevxi = x
    this.prevyi = y
  }
  _animateReturning() {
    let x, y, slope
    if (this.j > 0) {
      let next_wp = this.waypoints[this.j - 1]
      let curr_wp = this.waypoints[this.j]
      x = curr_wp.x + (next_wp.x - curr_wp.x) * this.stepj / this.stepsize
      y = curr_wp.y + (next_wp.y - curr_wp.y) * this.stepj / this.stepsize
    }
    slope = (y - this.prevyj) / (x - this.prevxj)
    let dispy = -this.img.height/2
    let dispx = -this.img.width/2

    this.ctx_f.save()
    this.ctx_f.translate(x, y)
    this.ctx_f.rotate(-1 * Math.PI / 2 + Math.atan(slope))
    this.ctx_f.drawImage(this.img, 0, 0, this.img.width, this.img.height, dispx, dispy, this.img.width, this.img.height)
    this.stepj++
    if (this.stepj >= this.stepsize) {
      this.j--
      this.stepj = 0
      if (this.j < 0) {
        this.j = this.waypoints.length - 1
      }
    }
    this.ctx_f.restore()
    this.prevxj = x
    this.prevyj = y
  }
  drawRoad() {
    this.ctx_b.save()
    this.ctx_b.beginPath();
    this.ctx_b.lineWidth = 5
    this.ctx_b.strokeStyle = 'rgb(228,228,228)'
    this.ctx_b.moveTo(this.fromx, this.fromy)
    this.ctx_b.bezierCurveTo(this.fromx + this.x1 * (this.tox - this.fromx), this.fromy + this.y1 * (this.toy - this.fromy), this.fromx + this.x2 * (this.tox - this.fromx), this.fromy + this.y2 * (this.toy - this.fromy), this.tox, this.toy);
    this.ctx_b.stroke()
    this.ctx_b.restore()
  }
}