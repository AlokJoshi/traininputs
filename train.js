class Train {
  constructor(path, passengercoaches, goodscoaches) {
    this.path = path
    this.passengercoaches = passengercoaches
    this.goodscoaches = goodscoaches
    this.passengers = {}
    this.goods = {}
  }
  addPassengerCoach = async () => {
    this.passengercoaches++
    this.path.game.milestone.send(this.path.game.period,`Train:${this.path.name} passenger coaches increased to ${this.passengercoaches}`)
    await saveUpdatedTrainInfoToDB(this.path.PathIdInDB, this.passengercoaches, this.goodscoaches)
  }
  removePassengerCoach = async () => {
    if (this.passengercoaches > 0) {
      this.passengercoaches--
      this.path.game.milestone.send(this.path.game.period,`Train:${this.path.name} passenger coaches decreased to ${this.passengercoaches}`)
      await saveUpdatedTrainInfoToDB(this.path.PathIdInDB, this.passengercoaches, this.goodscoaches)
    }
  }
  addGoodsCoach = async () => {
    this.goodscoaches++
    this.path.game.milestone.send(this.path.game.period,`Train:${this.path.name} wagons increased to ${this.goodscoaches}`)
    await saveUpdatedTrainInfoToDB(this.path.PathIdInDB, this.passengercoaches, this.goodscoaches)
  }
  removeGoodsCoach = async () => {
    if (this.goodscoaches > 0) {
      this.goodscoaches--
      this.path.game.milestone.send(this.path.game.period,`Train:${this.path.name} wagons decreased to ${this.goodscoaches}`)
      await saveUpdatedTrainInfoToDB(this.path.PathIdInDB, this.passengercoaches, this.goodscoaches)
    }
  }
  get passenger_capacity() {
    return this.passengercoaches * Game.PASSENGER_COACH_CAPACITY
  }
  get wagon_capacity() {
    return this.goodscoaches * Game.WAGON_CAPACITY
  }
  get num_passengers_on_train() {
    //sums up passengers for each city
    let n = 0
    for (const city in this.passengers) {
      n += this.passengers[city]
    }
    return n
  }
  get goods_on_train() {
    //sums up goods for each city
    // let n=0
    // for (const city in this.goods) {
    //   n+=this.goods[city]
    // }
    // return n
    this.wagon_capacity
  }
  get passenger_room_available() {
    return this.passenger_capacity - this.num_passengers_on_train
  }
  get wagon_capacity_available() {
    return this.wagon_capacity - this.goods_on_train
  }
  boardPassengersFor(city, num) {
    //passengers object has a key for each city. The value is the number of passengers
    //travelling to that city
    if (!(city in this.passengers)) {
      this.passengers[city] = 0
    }
    this.passengers[city] += num
  }
  alightPassengersForCity(city) {
    if (!(city in this.passengers)) {
      console.error(`Error in alightPassengersForCity where city = ${city}`)
    }
    let num = this.passengers[city]
    this.passengers[city] = 0
    //return number of pasengers alighted
    return num
  }
  get occupancy() {
    return 1 - this.passenger_room_available / this.passenger_capacity
  }
  get wagonloading() {
    return 1 - this.passenger_room_available / this.wagon_capacity
  }
  saveInDB = async () => {
    console.log(`%cSaving train running on ${this.path.number}`, 'background: #222; color: #bada55')
    saveTrainToDB(this.path.PathIdInDB, this.passengercoaches, this.goodscoaches)
  }
}