class Field{
    constructor(x,y,w,h,ctx_foreground,ctx_background){
      this.x=x
      this.y=y
      this.w=w
      this.h=h
      this.ctx_f=ctx_foreground
      this.ctx_b=ctx_background
      this.color=`rgb(100,${150+Math.random()*200},100)`
      this.i=0
      this.startHarvest = 1000+Math.random()*5000
      this.speed = 0.1
      this.harvestingcomplete = Infinity
    }
    animate(){
      this.i++
      this.ctx_f.save()
      this.ctx_f.beginPath()
      this.ctx_f.moveTo(this.x,this.y)
      this.ctx_f.fillStyle=this.color
      this.ctx_f.fillRect(this.x,this.y,this.w,this.h)
      this.ctx_f.fill()
      this.ctx_f.restore()

      //draw a line of d thickness starting from top left of the square
      let d = 4
      let t_since_harvest_start = this.i-this.startHarvest
      if(t_since_harvest_start>0){

        let dist = t_since_harvest_start*this.speed
        let rowscompleted = Math.floor(dist/this.w) 
        let height = rowscompleted * d
        this.harvestingcomplete = (height == this.h?this.i:Infinity)
        if(this.harvestingcomplete<Infinity) this.startHarvest = this.i+1000
        
        if(height<this.h){
          //we need to draw a brown area indicating that havesting is done in that portion
          //over height and width
          let width = dist%this.w
          //we draw another line with width = d and length = width starting from x+height
          this.ctx_f.save()
          this.ctx_f.fillStyle='brown'
          this.ctx_f.strokeStyle='brown'
          this.ctx_f.beginPath()
          this.ctx_f.moveTo(this.x,this.y)
          this.ctx_f.fillRect(this.x,this.y,this.w,height)
          //we have to figure out if the harvestor is starting from left or from right
          this.ctx_f.lineWidth=d
          this.ctx_f.fillStyle='gray'
          if(rowscompleted % 2 ==0){
            this.ctx_f.moveTo(this.x,this.y+height)
            this.ctx_f.lineTo(this.x+width,this.y+height)
            this.ctx_f.stroke()
            //draw the tractor 
            this.ctx_f.moveTo(this.x+width,this.y+height)
            this.ctx_f.fillRect(this.x+width,this.y+height,3,4)
            this.ctx_f.fill()
          }else{
            this.ctx_f.moveTo(this.x+this.w,this.y+height)
            this.ctx_f.lineTo(this.x+this.w-width,this.y+height)
            this.ctx_f.stroke()
            //draw the tractor 
            this.ctx_f.moveTo(this.x+this.w-width,this.y+height)
            this.ctx_f.fillRect(this.x+this.w-width,this.y+height,3,4)
            this.ctx_f.fill()
          }
          this.ctx_f.restore()
        }
      }
      this.ctx_f.save()
      this.ctx_f.strokeStyle='black'
      this.ctx_f.lineWidth=0.1
      this.ctx_f.beginPath()
      this.ctx_f.moveTo(this.x,this.y)
      this.ctx_f.rect(this.x,this.y,this.w,this.h)
      this.ctx_f.stroke()
      this.ctx_f.restore()
    }
}