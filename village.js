class Village extends Location {
  //50 FPS imples one step in 1second
  static ANIMATION_SPEED=50
  constructor(name, x, y, period ) {
    super(x, y)
    this.name = name
    this.period = period 
    this.i=0
    this.step=0
  }
  animate(ctx){
    this.i++
    if(this.i%this.ANIMATION_SPEED==0){
      this.step++
    }
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(this.x,this.y)
    ctx.arc(this.x,this.y,Location.r,0,2*Math.PI)
    ctx.fill()

    //draw a person 20px away
    ctx.moveTo(this.x+20,this.y)

    //1px radius head
    ctx.arc(this.x+20,this.y,1,0,2*Math.PI)
    ctx.fill()

    //1px shoulders
    ctx.moveTo(this.x+20,this.y-2)
    ctx.lineTo(this.x+20,this.y+2)
    ctx.stroke()

    //1px arm at the end of each shoulder in walk action
    ctx.moveTo(this.x+20,this.y-2)
    ctx.lineTo(this.x+21,this.y-2)
    ctx.stroke()
    ctx.moveTo(this.x+20,this.y+2)
    ctx.lineTo(this.x+19,this.y+2)
    ctx.stroke()
    ctx.restore()
  }
}