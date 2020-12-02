class Train {
  constructor(num_passenger_coaches,num_goods_coaches,timestarted) {
    this.num_passenger_coaches = num_passenger_coaches
    this.num_goods_coaches = num_goods_coaches
    this.timestarted = timestarted
    this._num_passengers_on_train = 0
    this.passengers = {}
  }
  addPassengerCoach(){
    this.num_passenger_coaches++  
  }
  removePassengerCoach(){
    this.num_passenger_coaches--  
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
  get passenger_capacity(){
    return this.num_passenger_coaches*Game.PASSENGER_COACH_CAPACITY
  }
  get num_passengers_on_train(){
    //sums up passengers for each city
    let n=0
    for (const city in this.passengers) {
      n+=this.passengers[city]
    }
    return n
  }
  get passenger_room_available(){
    return this.passenger_capacity-this.num_passengers_on_train
  }
  boardPassengersFor(city,num){
    //passengers object has a key for each city. The value is the number of passengers
    //travelling to that city
    if(!(city in this.passengers)){
      this.passengers[city]=0
    }
    this.passengers[city]+=num
  }
  alightPassengersForCity(city){
    if(!(city in this.passengers)){
      console.error(`Error in alightPassengersForCity`)
    }
    let num = this.passengers[city]
    this.passengers[city]=0
    //return number of pasengers alighted
    return num
  }
  get occupancy(){
    return 1-this.passenger_room_available/this.passenger_capacity
  }

}