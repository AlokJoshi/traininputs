class Field {
  static CROP_GROWING = 1
  static CROP_BEING_HARVESTED = 2
  static FIELD_LYING_FALLOW = 3
  static FALLOW_FOR_PERIODS = 200
  static TIME_TO_MATURE = 4000
  static FALLOW_RED=155
  static FALLOW_GREEN=118
  static FALLOW_BLUE=83
  static FIELD_CROP_RED=100
  static FIELD_CROP_BLUE=100
  static FALLOW_COLOR = `rgb(${Field.FALLOW_RED},${Field.FALLOW_GREEN},${Field.FALLOW_BLUE})`
  static fallowColorNumber(){
    return (Field.FALLOW_RED<<16) + (Field.FALLOW_GREEN<<8) + Field.FALLOW_BLUE
  } 
  
  
  constructor(x, y, w, h, ctx_foreground, ctx_background) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.ctx_f = ctx_foreground
    this.ctx_b = ctx_background
    this.green = 150+Math.random()*100
    this.color = `rgb(${Field.FIELD_CROP_RED},${this.green},${Field.FIELD_CROP_BLUE})`
    this.i = 0
    this.speed = 0.1
    this.harvestingcomplete = false
    this.state = Field.CROP_GROWING
    this.startHarvest = Math.random() * 500
    this.startGrowing = null
  }
  animate() {
    this.i++

    /* there are 4 states
    1. the crops are in the growing state. switch to the next state when i >= startHarvest 
    2. the land is being harvested. Switch to next state when harvesting complete
    3. land is in fallow state. Switch to next state after a gap of FALLOW_FOR_PERIODS
     
    The game starts in state 1
    */
    if(this.state == Field.CROP_GROWING && this.i>=this.startHarvest){
      this.state = Field.CROP_BEING_HARVESTED
    }
    if(this.state == Field.FIELD_LYING_FALLOW && this.i>=this.startGrowing){
      this.state = Field.CROP_GROWING
      this.startHarvest = this.i+Field.TIME_TO_MATURE
    }
    if (this.state == Field.CROP_GROWING) {
      this._drawCropGrowing()
    } else if (this.state == Field.CROP_BEING_HARVESTED) {
      this._drawCrop()
      //now show the part of the field that does not have the crop any longer
      //draw a line of d thickness starting from top left of the square
      let d = 3
      let t_since_harvest_start = this.i - this.startHarvest
      if (t_since_harvest_start > 0) {

        let dist = t_since_harvest_start * this.speed
        let rowscompleted = Math.floor(dist / this.w)
        let height = rowscompleted * d
        this.harvestingcomplete = height >= this.h
        if (this.harvestingcomplete) {
          this.state = Field.FIELD_LYING_FALLOW
          this.startGrowing=this.i+Field.FALLOW_FOR_PERIODS
        } else {
          //we need to draw a brown area indicating that havesting is done in that portion
          //over height and width
          let width = dist % this.w
          //we draw another line with width = d and length = width starting from x+height
          this.ctx_f.save()
          this.ctx_f.fillStyle = Field.FALLOW_COLOR
          this.ctx_f.strokeStyle = Field.FALLOW_COLOR
          this.ctx_f.beginPath()
          this.ctx_f.moveTo(this.x, this.y)
          this.ctx_f.fillRect(this.x, this.y, this.w, height)
          //we have to figure out if the harvestor is starting from left or from right
          //this.ctx_f.lineWidth = d
          if (rowscompleted % 2 == 0) {
            this.ctx_f.moveTo(this.x, this.y + height)
            this.ctx_f.fillRect(this.x, this.y + height, width, d)
            //this.ctx_f.stroke()
            //draw the tractor 
            this.ctx_f.fillStyle = 'darkgray'
            this.ctx_f.moveTo(this.x + width, this.y + height)
            this.ctx_f.fillRect(this.x + width, this.y + height, 4, d)
            this.ctx_f.fill()
          } else {
            this.ctx_f.moveTo(this.x + this.w-width, this.y + height)
            this.ctx_f.fillRect(this.x + this.w-width, this.y + height, width, d)
            this.ctx_f.stroke()
            //draw the tractor 
            this.ctx_f.fillStyle = 'darkgray'
            this.ctx_f.moveTo(this.x + this.w - width, this.y + height)
            this.ctx_f.fillRect(this.x + this.w - width, this.y + height, 4, d)
            this.ctx_f.fill()
          }
          this.ctx_f.restore()
        }
      }
    } else if (this.state == Field.FIELD_LYING_FALLOW) {
      this.ctx_f.save()
      this.ctx_f.beginPath()
      this.ctx_f.moveTo(this.x, this.y)
      this.ctx_f.fillStyle = Field.FALLOW_COLOR
      this.ctx_f.fillRect(this.x, this.y, this.w, this.h)
      this.ctx_f.fill()
      this.ctx_f.restore()
    }
    //mark the boundary of the field with a black line
    this.ctx_f.save()
    this.ctx_f.strokeStyle = 'rgba(0,0,0,0.5)'
    this.ctx_f.lineWidth = 0.1
    this.ctx_f.beginPath()
    this.ctx_f.moveTo(this.x, this.y)
    this.ctx_f.rect(this.x, this.y, this.w, this.h)
    this.ctx_f.stroke()
    this.ctx_f.restore()
  }
  _drawCropGrowing() {
    //draws the field with the crop in the crop color
    this.ctx_f.save()
    this.ctx_f.beginPath()
    this.ctx_f.moveTo(this.x, this.y)
    this.ctx_f.fillStyle = this._fieldColor()
    this.ctx_f.fillRect(this.x, this.y, this.w, this.h)
    this.ctx_f.fill()
    this.ctx_f.restore()
  }
  _drawCrop() {
    //draws the field with the crop in the crop color
    this.ctx_f.save()
    this.ctx_f.beginPath()
    this.ctx_f.moveTo(this.x, this.y)
    this.ctx_f.fillStyle = this.color
    this.ctx_f.fillRect(this.x, this.y, this.w, this.h)
    this.ctx_f.fill()
    this.ctx_f.restore()
  }
  _fieldColorNumber(){
    return (Field.FIELD_CROP_RED<<16) + (this.green<<8) + (Field.FIELD_CROP_BLUE)
  }
  _fieldColor(){
    let factor= (this.startHarvest-this.i)/Field.TIME_TO_MATURE

    let x1 = Field.FIELD_CROP_RED
    let x2 = Field.FALLOW_RED
    let newred = Math.round(x1-(x1-x2)*factor)

    x1 = this.green
    x2 = Field.FALLOW_GREEN
    let newgreen = Math.round(x1-(x1-x2)*factor)
    
    x1 = Field.FIELD_CROP_BLUE
    x2 = Field.FALLOW_BLUE
    let newblue = Math.round(x1-(x1-x2)*factor)

    
    //let newval= Math.floor( newred * Math.pow(2,16) + newgreen * Math.pow(2,8) + newblue )

    let newval = '#' + `${newred.toString(16)}`+`${newgreen.toString(16)}`+`${newblue.toString(16)}`
    console.log(`value returned by _fieldColor() ${newval}`)
    return newval
  }
}