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
  get length() {
    return Math.sqrt((this.p2.x - this.p1.x) * (this.p2.x - this.p1.x) + (this.p2.y - this.p1.y) * (this.p2.y - this.p1.y))
  }
}