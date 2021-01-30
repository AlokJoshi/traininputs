class Villages {
  constructor() {
    this.info = []
  }
  animate() {
    this.info.forEach(village=>village.animate())
  }
}