class Cloud {
  static FRAME_WHEN_CLOUD_APPEARS = 500
  static FRAMES_CLOUD_LASTS = 500
  constructor(canvasw, canvash, cloudImage, ctx) {
    this.w = canvasw
    this.h = canvash
    this.ctx = ctx
    this.cloudImage = cloudImage
    //stores the frame number
    this.i = 0
  }
  animate() {
    this.i++
    if(this.i>Cloud.FRAME_WHEN_CLOUD_APPEARS+Cloud.FRAMES_CLOUD_LASTS) {
      this.i=0
      //clear the canvas completely
      this.ctx.save()
      this.ctx.clearRect(0, 0, this.w, this.h)
      this.ctx.restore()
    }
    if(this.i>Cloud.FRAME_WHEN_CLOUD_APPEARS){
      this.ctx.clearRect(0,0,this.w,this.h)
      this.ctx.save()
      this.ctx.beginPath()
      let offsetx = this.w*(-1+2*(this.i-Cloud.FRAME_WHEN_CLOUD_APPEARS)/Cloud.FRAME_WHEN_CLOUD_APPEARS)
      let offsety = this.h*(-1+2*(this.i-Cloud.FRAME_WHEN_CLOUD_APPEARS)/Cloud.FRAME_WHEN_CLOUD_APPEARS)
      this.ctx.drawImage(this.cloudImage,0,0,this.cloudImage.width, this.cloudImage.height,offsetx,offsety,this.w, this.h)
      this.ctx.restore()
    }
  }
}