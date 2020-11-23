class Hud{
  constructor(canvasElement){
    this.canvasElement = canvasElement
    this.ctx = canvasElement.getContext('2d')
  }
  display(text){
    console.log(this.canvasElement.zIndex)
    this.ctx.clearRect(0,0,this.canvasElement.width,this.canvasElement.height)
    this.ctx.fillStyle='rgba(100,100,100,.2)'
    this.ctx.fillRect(0,0,this.canvasElement.width,40)
    this.ctx.fillStyle='rgba(255,255,255,1)'
    this.ctx.strokeStyle='rgba(255,255,255,0.1)'
    this.ctx.font = "20px Comic Sans MS"
    for(let i=0;i<Math.ceil(text.length/100);i++){
      this.ctx.fillText(text.substr(i*100,100),0,(i+1)*20,800)
    }
  }
}