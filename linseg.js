class LinSeg {
  constructor(p1, p2) {
    this.p1 = p1
    this.p2 = p2
    this.w = 8    //width of sleepers
  }
  draw(ctx, pathEditMode) {
    console.log(`pathEditMode in LinSeg draw${pathEditMode}`)
    ctx.save()
    ctx.strokeStyle = pathEditMode ? 'rgb(255,0,0)' : 'rgb(0,0,255)'
    ctx.lineWidth = LINE_WIDTH
    ctx.moveTo(this.p1.x, this.p1.y)
    if (pathEditMode) {
      ctx.setLineDash([3, 5])
    }
    else {
      ctx.setLineDash([])
    }
    ctx.lineTo(this.p2.x, this.p2.y)
    ctx.stroke()
    ctx.restore()
  }
  drawBackground(ctx) {
    let l = Math.sqrt((this.p1.x - this.p2.x) * (this.p1.x - this.p2.x) + (this.p1.y - this.p2.y) * (this.p1.y - this.p2.y))
    let n = Math.floor(l / this.w)
    let m = Math.atan((this.p2.y - this.p1.y) / (this.p2.x - this.p1.x))
    let deltax = this.w * Math.sin(m) / 2
    let deltay = this.w * Math.cos(m) / 2
    ctx.save()
    ctx.strokeStyle = 'rgb(0,0,0)'
    ctx.lineWidth = 1
    ctx.moveTo(this.p1.x, this.p1.y)
    ctx.setLineDash([])
    ctx.lineTo(this.p2.x, this.p2.y)
    ctx.stroke()
    for (let i = 0; i < n; i++) {
      //find the next point
      let px = this.p1.x + (this.w * i / l) * (this.p2.x - this.p1.x)
      let py = this.p1.y + (this.w * i / l) * (this.p2.y - this.p1.y)
      let p1x = px - deltax
      let p1y = py + deltay
      let p2x = px + deltax
      let p2y = py - deltay
      ctx.moveTo(p1x, p1y)
      ctx.lineTo(p2x, p2y)
      ctx.stroke
    }
    ctx.restore()
  }
  get length() {
    return Math.sqrt((this.p2.x - this.p1.x) * (this.p2.x - this.p1.x) + (this.p2.y - this.p1.y) * (this.p2.y - this.p1.y))
  }
}