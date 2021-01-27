class Vehicles {
  constructor(ctx_foreground,ctx_background) {
    this.vehicles = []
    this.ctx_foreground=ctx_foreground
    this.ctx_background=ctx_background
  }
  add(road, vehicletype, vehiclespeed) {
    let vehicle = new Vehicle(road,this.ctx_foreground,this.ctx_background, vehicletype, vehiclespeed)
    this.vehicles.push(vehicle)
  }
  animate(){
    this.vehicles.forEach(vehicle=>vehicle.animate())
  }
}