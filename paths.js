class Paths {
  constructor(game) {
    this.game = game
    this._paths = []
  }
  addPath(path) {
    this._paths.push(path)
  }
  addApproxStationLocation(pathNum, x, y){
    this._paths[pathNum - 1].addApproxStationLocation(x, y)
  }
  addStation(pathNum, x, y) {
    this._paths[pathNum - 1].addStation(x, y)
  }
  updateStations(){
    for (let i = 0; i < this.numPaths; i++) {
      this._paths[i].updateStations()
    }    
  }
  get numPaths() {
    return this._paths.length
  }
  pathColor(i){
    let color;
    switch (i) {
      case 0:
        color='rgb(0,0,255)'
        break;
      case 1:
        color='rgb(0,255,0)'
        break;
      case 2:
        color='rgb(255,0,0)'
        break;
      case 3:
        color='rgb(0,255,255)'
        break;
      case 4:
        color='rgb(255,0,255)'
        break;
      case 5:
        color='rgb(255,255,0)'
        break;
      case 6:
        color='rgb(0,0,128)'
        break;
      case 7:
        color='rgb(0,128,0)'
        break;
      case 8:
        color='rgb(128,0,0)'
        break;
      case 9:
        color='rgb(128,128,128)'
        break;
    
      default:
        break;
    }
    return color
  }
  getPath(i) {
    return this._paths[i - 1]
  }
  get length() {
    return this._paths.length
  }
  get paths() {
    return this._paths
  }
  get pathLength(){
    let pathlength=0
    for (let i = 0; i < this.numPaths; i++) {
      pathlength+=this._paths[i].pathLength
    }
    return pathlength
  }
  draw() {
    for (let i = 0; i < this.numPaths; i++) {
      this._paths[i].draw(this.pathColor(i))
    }
  }
  drawStations(ctx){
    for (let i = 0; i < this.numPaths; i++) {
      this._paths[i].drawStations(ctx)
    }  
  }
  drawBackground(ctx) {
    for (let i = 0; i < this.numPaths; i++) {
      this._paths[i].drawBackground(ctx)
    }
  }
  animate(canvas, ctx_background) {
    for (let i = 0; i < this.numPaths; i++) {
      this._paths[i].animate(canvas, ctx_background)
    }
  }
  updateNeighbors() {
    for (let i = 0; i < this.numPaths; i++) {
      this._paths[i].updateNeighbors()
    }
  }
  createWayPoints(){
    for (let i = 0; i < this.numPaths; i++) {
      this._paths[i].createWayPoints()
    }
  }
  get atLeastOnePathFinalized(){
    return this._paths.some(p=>p.finalized)
  }
}