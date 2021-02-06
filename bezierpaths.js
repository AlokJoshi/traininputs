class BezierPaths {
  constructor(ctx_background,ctx_foreground,strokestyle) {
    this.paths = []
    this.ctx_background=ctx_background
    this.ctx_foreground=ctx_foreground
    this.strokestyle=strokestyle
  }
  add(x1, y1, x2, y2, fromx, fromy, tox, toy, speed, roadtype) {
    let strokestyle = roadtype==Game.HIGHWAY?'rgb(112,112,112)':'brown'
    let roadwidth = roadtype==Game.HIGHWAY?5:2
    let bp = new BezierPath(x1, y1, x2, y2, fromx, fromy, tox, toy, this.ctx_background, this.ctx_foreground,speed,strokestyle,roadwidth)
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