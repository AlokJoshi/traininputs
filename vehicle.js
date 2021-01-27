class Vehicle {
  constructor(road,ctx_foreground,ctx_background, imgElement, vehiclespeed) {
    this.road = road
    this.ctx_f = ctx_foreground
    this.ctx_b = ctx_background
    this.imgElement = imgElement
    this.vehiclespeed = vehiclespeed

    //going from from to to
    this.i = 0
    //returning going from to to from
    this.j = this.road.waypoints.length - 1

    //for every stepsize steps i or j moves by 1
    this.stepi = 0
    this.stepj = 0

    this.speed = vehiclespeed
    this.stepsize = 11 - vehiclespeed

    this.prevxi = 0, this.prevyi = 0
    this.prevxj = 0, this.prevyj = 0
  }
  animate() {
    //animate this vehicle on the road
    this._animateGoing()
    this._animateReturning()
  }
  _animateGoing() {
    let x, y, slope
    if (this.i < this.road.waypoints.length - 2) {
      let next_wp = this.road.waypoints[this.i + 1]
      let curr_wp = this.road.waypoints[this.i]
      x = curr_wp.x + (next_wp.x - curr_wp.x) * this.stepi / this.stepsize
      y = curr_wp.y + (next_wp.y - curr_wp.y) * this.stepi / this.stepsize
    }
    slope = (y - this.prevyi) / (x - this.prevxi)
    let dispy = -this.imgElement.height / 2
    let dispx = -this.imgElement.width / 2
    this.ctx_f.save()
    this.ctx_f.translate(x, y)
    this.ctx_f.rotate(Math.PI / 2 + Math.atan(slope))
    this.ctx_f.drawImage(this.imgElement, 0, 0, this.imgElement.width, this.imgElement.height, dispx, dispy, this.imgElement.width, this.imgElement.height)
    this.stepi++
    if (this.stepi >= this.stepsize) {
      this.i++
      this.stepi = 0
      if (this.i > this.road.waypoints.length - 1) {
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
      let next_wp = this.road.waypoints[this.j - 1]
      let curr_wp = this.road.waypoints[this.j]
      x = curr_wp.x + (next_wp.x - curr_wp.x) * this.stepj / this.stepsize
      y = curr_wp.y + (next_wp.y - curr_wp.y) * this.stepj / this.stepsize
    }
    slope = (y - this.prevyj) / (x - this.prevxj)
    let dispy = -this.imgElement.height / 2
    let dispx = -this.imgElement.width / 2
    
    this.ctx_f.save()
    this.ctx_f.translate(x, y)
    this.ctx_f.rotate(-1 * Math.PI / 2 + Math.atan(slope))
    this.ctx_f.drawImage(this.imgElement, 0, 0, this.imgElement.width, this.imgElement.height, dispx, dispy, this.imgElement.width, this.imgElement.height)
    this.stepj++
    if (this.stepj >= this.stepsize) {
      this.j--
      this.stepj = 0
      if (this.j < 0) {
        this.j = this.road.waypoints.length - 1
      }
    }
    this.ctx_f.restore()
    this.prevxj = x
    this.prevyj = y
  }
}