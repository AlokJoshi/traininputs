class Cash {
  constructor() {
    this.periods = []
    //each array item will consist of 
    //a CashFlow object
  }
  add(value){
    this.periods.push(value)
  }
}