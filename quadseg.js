class QuadSeg {
  constructor(p1, p2, cp) {
    this.p1 = p1
    this.p2 = p2
    this.cp = cp
  }
  draw(ctx, pathEditMode) {
    ctx.save()
    ctx.strokeStyle = pathEditMode ? "rgb(255,0,0)" : "rgb(0,0,255)"
    ctx.lineWidth = LINE_WIDTH
    ctx.beginPath()
    ctx.moveTo(this.p1.x, this.p1.y)
    ctx.quadraticCurveTo(this.cp.x, this.cp.y, this.p2.x, this.p2.y)
    ctx.stroke()
    ctx.restore()
  }
  drawBackground(ctx) {
    ctx.save()
    ctx.strokeStyle = "rgb(0,0,0)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(this.p1.x, this.p1.y)
    ctx.quadraticCurveTo(this.cp.x, this.cp.y, this.p2.x, this.p2.y)
    ctx.stroke()
    ctx.restore()
  }
  get length() {
    //fix this
    return 100
  }
}