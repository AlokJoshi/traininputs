class Hud{
  constructor(canvasElement){
    this.canvasElement = canvasElement
    this.ctx = canvasElement.getContext('2d')
    this.info = ''
  }
  display(text){
    console.log(`In Hud display: ${info}`)
    this.ctx.clearRect(0,0,this.canvasElement.width,this.canvasElement.height)
    this.ctx.fillStyle='rgba(100,100,100,.2)'
    this.ctx.fillRect(0,0,this.canvasElement.width,60)
    this.ctx.fillStyle='rgba(255,255,255,1)'
    this.ctx.strokeStyle='rgba(255,255,255,0.1)'
    this.ctx.font = "15px Comic Sans MS"
    for(let i=0;i<Math.ceil(text.length/150);i++){
      this.ctx.fillText(text.substr(i*150,150),0,(i+1)*20,1500)
    }
    this.ctx.fillText(this.info,0,40)
  }
  displayCityInfo(city){
    let x=city.x
    let y=city.y
    let txt = `Pop: ${city.population}`
    this.ctx.fillStyle='rgba(255,255,255,1)'
    this.ctx.font = "10px Comic Sans MS"
    this.ctx.fillText(txt,x,y)
  }
}