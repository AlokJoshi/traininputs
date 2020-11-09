class Paths {
  constructor() {
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
  getPath(i) {
    return this._paths[i - 1]
  }
  get length() {
    return this._paths.length
  }
  get paths() {
    return this._paths
  }
  draw(pathEditMode, selectedPathNum) {
    for (let i = 0; i < this.numPaths; i++) {
      this._paths[i].draw(pathEditMode && (selectedPathNum === i + 1))
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
}