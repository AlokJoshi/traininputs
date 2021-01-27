class BezierPaths {
  constructor(ctx_background,ctx_foreground) {
    this.paths = []
    this.ctx_background=ctx_background
    this.ctx_foreground=ctx_foreground
  }
  add(x1, y1, x2, y2, fromx, fromy, tox, toy, speed) {
    let bp = new BezierPath(x1, y1, x2, y2, fromx, fromy, tox, toy, this.ctx_background, this.ctx_foreground,speed)
    this.paths.push(bp)
    return bp
  }
  animate(){
    this.paths.forEach(p=>p.animate())
  }
  drawRoads(){
    this.paths.forEach(p=>p.drawRoad())  
  }
}