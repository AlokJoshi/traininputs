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
    ctx.moveTo(this.x+Game.CITY_RADIUS,this.y)
    ctx.arc(this.x,this.y,Game.CITY_RADIUS,0,2*Math.PI,false)
    ctx.strokeStyle='rgba(0,255,255,0.8)'
    ctx.stroke()
  }

}