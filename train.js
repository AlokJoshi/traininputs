class Train {
  constructor(num_passenger_coaches,num_goods_coaches,timestarted) {
    //this.path = path
    this.num_passenger_coaches = num_passenger_coaches
    this.num_goods_coaches = num_goods_coaches
    this.timestarted = timestarted
  }
  addPassengerCoach(){
    this.num_passenger_coaches++  
  }
  addGoodsCoach(){
    this.num_goods_coaches++  
  }
  get capitalCost(){
    const engine = 10000
    const goodscoach=500
    const passengercoach=1000
    //const path = paths.getPath(this.path)
    //const pathlength = path.pathLength
    return engine+goodscoach*this.num_goods_coaches+passengercoach*this.num_passenger_coaches
  }
  get runningCostPerTimePeriod(){
    return Math.floor(this.capitalCost*0.5)+this.num_passenger_coaches*5000+this.num_goods_coaches*2000
  }
}