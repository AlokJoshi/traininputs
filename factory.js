class Factory {
  constructor(x, y, w, h, degrotation, ctx) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.degrotation = degrotation
    this.ctx = ctx
  }
  draw() {
    this.ctx.save()
    this.ctx.strokeStyle = 'black'
    this.ctx.lineWidth = 0.1
    this.ctx.fillStyle = 'rgb(222,184,135)' //'burlywood'
    this.ctx.translate(this.x, this.y)
    this.ctx.rotate(Math.PI * this.degrotation / 180)
    this.ctx.beginPath()
    //square
    this.ctx.moveTo(0, 0)
    this.ctx.fillRect(0, 0, this.w, this.h)
    this.ctx.strokeRect(0, 0, this.w, this.h)

    this.ctx.moveTo(0, 0)
    this.ctx.lineTo(this.h / 2, this.h / 2)
    this.ctx.lineTo(this.w - this.h / 2, this.h / 2)
    this.ctx.lineTo(this.w, 0)
    this.ctx.moveTo(0, this.h)
    this.ctx.lineTo(this.h / 2, this.h / 2)
    this.ctx.moveTo(this.w - this.h / 2, this.h / 2)
    this.ctx.lineTo(this.w, this.h)
    this.ctx.stroke()

    this.ctx.restore()
  }
  
  animate() {
    this.draw()
  }
}

class TimberMill extends Factory {
  constructor(x, y, w, h, rotation, ctx) {
    super(x, y, w, h, rotation, ctx)
  }
}
class Quarry extends Factory {
  constructor(x, y, w, h, rotation, ctx) {
    super(x, y, w, h, rotation, ctx)
  }
}