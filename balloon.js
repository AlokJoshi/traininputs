class Balloon {
  speed = 5
  radius = 100
  constructor(ctx,x,y,text) {
    this.x=x
    this.y=y
    this.ctx=ctx
    this.text=text
  }
  show(){
    setInterval(()=>{
      this.y--
      this._draw()
    },10)  
  }
  _draw(){
    this.ctx.beginPath()
    this.ctx.arc(this.x,this.y,this.radius,0,2*Math.PI)  
    this.ctx.stroke()
  }
}