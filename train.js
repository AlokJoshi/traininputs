class Train {
  constructor(num_passenger_coaches,num_wagons) {
    this.num_passenger_coaches = num_passenger_coaches
    this.num_wagons = num_wagons
    this.passengers = {}
    this.goods = {}
  }
  addPassengerCoach(){
    this.num_passenger_coaches++  
  }
  removePassengerCoach(){
    this.num_passenger_coaches--  
  }
  addGoodsCoach(){
    this.num_wagons++  
  }
  // get capitalCost(){
  //   return Game.COST_ENGINE + Game.COST_GOODS_COACH*this.num_wagons+Game.COST_PASSENGER_COACH*this.num_passenger_coaches
  // }
  // get runningCostPerTimePeriod(){
  //   return Math.floor(this.capitalCost*0.5)+this.num_passenger_coaches*5000+this.num_wagons*2000
  // }
  get passenger_capacity(){
    return this.num_passenger_coaches*Game.PASSENGER_COACH_CAPACITY
  }
  get wagon_capacity(){
    return this.num_wagons*Game.WAGON_CAPACITY
  }
  get num_passengers_on_train(){
    //sums up passengers for each city
    let n=0
    for (const city in this.passengers) {
      n+=this.passengers[city]
    }
    return n
  }
  get goods_on_train(){
    //sums up goods for each city
    // let n=0
    // for (const city in this.goods) {
    //   n+=this.goods[city]
    // }
    // return n
    this.wagon_capacity
  }
  get passenger_room_available(){
    return this.passenger_capacity-this.num_passengers_on_train
  }
  get wagon_capacity_available(){
    return this.wagon_capacity-this.goods_on_train
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
  get wagonloading(){
    return 1-this.passenger_room_available/this.wagon_capacity
  }
}