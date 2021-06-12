class Passengers extends Traffic{
  constructor(){
    super()
  }
  addPassengers(from,to,num){
    this.addTraffic(from,to,num)
  }
  subtractPassengers(from,to,num){
    this.subtractTraffic(from,to,num)
  }
}