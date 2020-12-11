class LinSeg {
  constructor(segment_number,p1, p2) {
    this.segment_number=segment_number
    this.p1 = p1
    this.p2 = p2
    this.w = 6    //width between sleepers
    this.l = 6    //length of sleepers
  }
  // draw(ctx,pathColor) {
  //   ctx.save()
  //   ctx.strokeStyle = 'rgb(0,0,255)'
  //   ctx.lineWidth = Game.LINE_WIDTH
  //   ctx.beginPath()
  //   ctx.moveTo(this.p1.x, this.p1.y)
  //   ctx.lineTo(this.p2.x, this.p2.y)
  //   ctx.stroke()
  //   ctx.restore()
  // }
  drawBackground(ctx) {
    //console.log(`drawBackground on linSeg called for ${this}` )

    let l = this.length
    let n = Math.floor(l / this.w)
    let m = Math.atan((this.p2.y - this.p1.y) / (this.p2.x - this.p1.x))
    let deltax = this.w
    let deltay = this.l/2
    ctx.save()
    ctx.strokeStyle = 'rgb(0,0,0)'
    ctx.lineWidth = 0.1
    ctx.moveTo(this.p1.x, this.p1.y)
    ctx.lineTo(this.p2.x, this.p2.y)
    ctx.stroke()
    let msign = Math.sign(this.p2.x-this.p1.x)
    ctx.translate(this.p1.x,this.p1.y)
    ctx.rotate(m)
    //console.log(m)
    for (let i = 0; i < n; i++) {
      //find the next point
      ctx.beginPath()
      ctx.moveTo(msign*deltax*i,deltay)
      ctx.lineTo(msign*deltax*i,-deltay)
      ctx.stroke()
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.restore()
  }
  get length() {
    return Math.sqrt((this.p2.x - this.p1.x) * (this.p2.x - this.p1.x) + (this.p2.y - this.p1.y) * (this.p2.y - this.p1.y))
  }
}