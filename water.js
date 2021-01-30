class Water {
  static FRACTION = 0.0001
  static COLOR = 'rgb(255,255,255)'
  constructor(canvasw, canvash, ctx_background, ctx_foreground) {
    //array stores all the pixels on the screen that have water
    //each array element is an object with x,y properties
    this.info = []
    //extract the image data for water pixels
    this.w = canvasw
    this.h = canvash
    this.ctx_background = ctx_background
    this.ctx_foreground = ctx_foreground
    let imgData = this.ctx_background.getImageData(0, 0, this.w, this.h)
    for (let x = 0; x < this.w; x++) {
      for (let y = 0; y < this.h; y++) {
        let index = x * 4 + y * this.w * 4
        if (imgData.data[index] == 77 && imgData.data[index + 1] == 77 && imgData.data[index + 2] == 243) {
          this.info.push({ x: x, y: y })
        }
      }
    }

    this.length = this.info.length
  }
  animate() {
    //at random create white circles
    let length = this.info.length
    this.ctx_foreground.save()
    this.ctx_foreground.beginPath()
    this.ctx_foreground.fillStyle = Water.COLOR
    for (let i = 0; i < Math.floor(Water.FRACTION * length); i++) {
      //randomly select a pixel
      let pixel = this.info[Math.floor(Math.random() * length)]
      this.ctx_foreground.moveTo(pixel.x, pixel.y)
      this.ctx_foreground.arc(pixel.x, pixel.y, 0.5, 0, 2 * Math.PI)
      this.ctx_foreground.fill()
    }
    this.ctx_foreground.restore()
  }
}