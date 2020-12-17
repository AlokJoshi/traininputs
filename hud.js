class Hud{
  constructor(canvasElement){
    this.canvasElement = canvasElement
    this.ctx = canvasElement.getContext('2d')
    this._info = []
  }
  set info(value){
    this._info.push(value)
    if(this._info.length>=200){
      this._info.shift()
    }
  }
  display(text,state,train){
    this.canvasElement.height = state==Game.RUNNING_STATE?1000:50
    this.ctx.fillStyle='rgba(256,256,256,.7)'
    this.ctx.fillRect(0,0,this.canvasElement.width,this.canvasElement.height)
    this.ctx.clearRect(0,30,this.canvasElement.width,this.canvasElement.height)
    // this.ctx.fillStyle='rgba(100,100,100,.2)'
    // this.ctx.fillRect(0,0,this.canvasElement.width,60)
    this.ctx.strokeStyle='rgba(256,256,256,0.1)'
    this.ctx.font = "15px Comic Sans MS"
    this.ctx.fillStyle='rgba(0,0,0,1)'
    for(let i=0;i<Math.ceil(text.length/150);i++){
      this.ctx.fillText(text.substr(i*150,150),0,(i+1)*20,1500)
    }
    let newInfo = this._info.filter(item=>item.train==train)
    newInfo = newInfo.slice().reverse()
    this.ctx.fillStyle='rgba(0,0,0,1)'
    this.ctx.font = "10px Comic Sans MS"
    this.ctx.fillText(`Train: ${train}`,0,150)
    for(let i = 0; i < newInfo.length ; i++ ){
      if(170+i*20<Game.HEIGHT){
        this.ctx.fillText(newInfo[i].text,0,170+i*20)
      }
    }
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