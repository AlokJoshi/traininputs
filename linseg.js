class LinSeg {
  constructor(segment_number,p1, p2) {
    this.segment_number=segment_number
    this.p1 = p1
    this.p2 = p2
    this.w = 10    //width between sleepers
    this.l = 6     //length of sleepers
  }
  draw(ctx,pathColor) {
    ctx.save()
    ctx.strokeStyle = pathColor
    ctx.lineWidth = LINE_WIDTH
    ctx.beginPath()
    ctx.moveTo(this.p1.x, this.p1.y)
    ctx.lineTo(this.p2.x, this.p2.y)
    ctx.stroke()
    ctx.restore()
  }
  drawBackground(ctx) {
    console.log(`drawBackground on linSeg called for ${this}` )

    let l = this.length
    //let l = Math.sqrt((this.p1.x - this.p2.x) * (this.p1.x - this.p2.x) + (this.p1.y - this.p2.y) * (this.p1.y - this.p2.y))
    let n = Math.floor(l / this.w)
    let m = Math.atan((this.p2.y - this.p1.y) / (this.p2.x - this.p1.x))
    let deltax = this.l * Math.sin(m) / 2
    let deltay = this.l * Math.cos(m) / 2
    ctx.save()
    ctx.strokeStyle = 'rgb(0,0,0)'
    ctx.lineWidth = 0.1
    ctx.moveTo(this.p1.x, this.p1.y)
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