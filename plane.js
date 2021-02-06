class Plane {
  constructor(bezierCurves, ctx) {
    this.ctx = ctx
    this.planeimage = Game.PLANE_IMAGE
    this.stepi = 0
    this.stepsize = 2
    this.i = 0
    this.w = Game.PLANE_IMAGE.width*0.5
    this.h = Game.PLANE_IMAGE.height*0.5
    
    this.waypoints = wayPointsFromBezierCurves(bezierCurves)

    this.j = this.waypoints.length - 1
  }
  animate() {
    let x, y, slope,sizefactor,dx,dy,tansign,theta
    if (this.i < this.waypoints.length - 2) {
      let next_wp = this.waypoints[this.i + 1]
      let curr_wp = this.waypoints[this.i]
      x = curr_wp.x + (next_wp.x - curr_wp.x) * this.stepi / this.stepsize
      y = curr_wp.y + (next_wp.y - curr_wp.y) * this.stepi / this.stepsize
    }
    slope = (y - this.prevyi) / (x - this.prevxi)
    
    dx = Math.sign(x - this.prevxi)
    dy = Math.sign(y - this.prevyi)
    tansign = Math.sign(Math.atan(slope))
    if((tansign==-1 && dx==1) || (tansign==1 && dy==+1)){
      theta=Math.atan(slope)
    }else if(tansign==-1 && dx==-1){
      theta=-1*Math.PI+Math.atan(slope)
    }else if(tansign==1 && dy==-1){
      theta=1*Math.PI+Math.atan(slope)
    }
    sizefactor = this.i/this.waypoints.length
    let dispy = -this.planeimage.height / 2
    let dispx = -this.planeimage.width / 2
    this.ctx.save()
    this.ctx.translate(x, y)
    this.ctx.rotate(theta)
    this.ctx.drawImage(this.planeimage, 0, 0, this.planeimage.width, this.planeimage.height, dispx, dispy, this.w*(1+sizefactor*3), this.h*(1+sizefactor*3))
    this.stepi++
    if (this.stepi >= this.stepsize) {
      this.i++
      this.stepi = 0
      if (this.i > this.waypoints.length - 1) {
        this.i = 0
      }
    }
    this.ctx.restore()
    this.prevxi = x
    this.prevyi = y
  }
}