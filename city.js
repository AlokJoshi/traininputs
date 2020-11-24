class City{
  constructor(name,x,y,population,traveldestination,growthrate){
    this.name=name
    this.x=x
    this.y=y
    this.population=population
    this.traveldestination=traveldestination
    this.growthrate=growthrate
  }
  draw(ctx){
    ctx.moveTo(this.x,this.y)
    ctx.arc(this.x,this.y,5,0,2*Math.PI,false)
    ctx.fillStyle='rgba(0,255,255,0.8)'
    ctx.fill()
  }

}