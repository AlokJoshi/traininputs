class QuadSeg {
  constructor(segment_number,p1, p2, cp) {
    this.segment_number=segment_number
    this.p1 = p1
    this.p2 = p2
    this.cp = cp
  }
  // draw(ctx,pathColor) {
  //   ctx.save()
  //   ctx.strokeStyle = pathColor
  //   ctx.lineWidth = Game.LINE_WIDTH
  //   ctx.beginPath()
  //   ctx.moveTo(this.p1.x, this.p1.y)
  //   ctx.quadraticCurveTo(this.cp.x, this.cp.y, this.p2.x, this.p2.y)
  //   ctx.stroke()
  //   ctx.restore()
  // }
  
  get length() {
    //approximation of a curved length
    return lineLength(this.p1.x,this.p1.y,this.p2.x,this.p2.y)*1.2
  }
}