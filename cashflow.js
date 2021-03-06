class CashFlow {
  constructor(game, openingcash, openingcumcapitalcost, openingcumdepreciation) {
    this.game = game
    this._openingcash = openingcash
    this._openingcumcapitalcost = openingcumcapitalcost
    this._openingcumdepreciation = openingcumdepreciation
    this._interest = 0
    this._ticketsales = 0
    this._depreciation = 0
    this._trackcost = 0
    this._stationcost = 0
    this._enginecost = 0
    this._coachcost = 0
    this._wagoncost = 0
    this._runningcost = 0
    this._maintenancecost = 0
    this._profit = 0
    this._tax = 0
    this._patd = 0
    this._closingcumcapitalcost = 0
    this._closingcumdepreciation = 0
    this._closingcash = 0

    this._cumtrackcost = 0
    this._cumstationcost = 0
    this._cumcoachcost = 0
    this._cumwagoncost = 0
    this._cumenginecost = 0

  }
  set ticketsales(value) {
    //console.log(`Ticket sales: ${value}`)
    this._ticketsales += value
  }
  get ticketsales() {
    return this._ticketsales
  }
  set trackcost(value) {
    this._trackcost += value
    this._cumtrackcost += value
  }
  get trackcost(){
    return this._trackcost
  }
  set stationcost(value) {
    this._stationcost += value
    this._cumstationcost += value
  }
  get stationcost(){
    return this._stationcost
  }
  set coachcost(value) {
    this._coachcost += value
    this._cumcoachcost += value
  }
  get coachcost(){
    return this._coachcost
  }
  set wagoncost(value) {
    this._wagoncost += value
    this._cumwagoncost += value
  }
  get wagoncost(){
    return this._wagoncost
  }
  set enginecost(value) {
    this._enginecost += value
    this._cumenginecost += value
  }
  get enginecost(){
    return this._enginecost
  }
  get runningcost() {
    return this._runningcost
  }
  get maintenancecost() {
    return this._maintenancecost
  }
  get profit() {
    return this._profit
  }
  get tax() {
    return this._tax
  }
  get patd() {
    return this._patd
  }
  get closingcash() {
    return Math.floor(this._closingcash)
  }
  get interest(){
    return this._interest
  }
  get cumstationcost(){
    return this._cumstationcost
  }
  get cumtrackcost(){
    return this._cumtrackcost
  }
  updateInterest() {
    let cc = this.closingcash
    if (cc < 0) {
      this._interest = cc * Game.INTEREST_PAID_PER_PERIOD
    } else {
      this._interest = cc * Game.INTEREST_EARNED_PER_PERIOD
    }
    //console.log(`Cash: ${cc}, interest:${this.interest}`)
  }
  updateMaintenanceCost() {
    //maintenance cost is based on the amount of capital cost 
    this._maintenancecost = 0.003 * this._closingcumcapitalcost
  }
  updateRunningCost() {
    //running cost is based on the total distance travelled by all the trains
    this._runningcost = this._cumtrackcost * 0.00001 + this._cumstationcost * 0.001
  }
  update() {
    this.updateMaintenanceCost()
    this.updateRunningCost()
    this.updateInterest()

    let capitalcost = this._trackcost + this._stationcost + this._coachcost + this._wagoncost + this._enginecost

    //update the cum capital cost
    this._closingcumcapitalcost = this._openingcumcapitalcost + capitalcost

    //the period depreciation is calculated on the closingcumcapitalcost on the assumption
    //that the capital cost is incurred in the beginning of the period but only on the remainder
    //value
    let remaindervalue = this._closingcumcapitalcost - this._openingcumdepreciation
    this._depreciation = remaindervalue * 1 / 200
    this._closingcumdepreciation = this._openingcumdepreciation + this._depreciation

    //profit
    this._profit = this._ticketsales + this._interest - this._runningcost - this._maintenancecost - this._depreciation

    //taxes
    this._tax = this._profit > 0 ? this._profit * 0.15 : 0

    //profit after taxes and depreciation
    this._patd = this._profit - this._tax

    //closing cash
    this._closingcash = this._openingcash + this._patd + this._depreciation - capitalcost
  }
  initPeriodVariables(){
    // console.log(`game.perio:${game.period},ticketsales:${this._ticketsales}`)
    this._trackcost = 0
    this._stationcost = 0
    this._coachcost = 0
    this._wagoncost = 0
    this._enginecost = 0
    this._ticketsales = 0
    this._interest = 0
    this._openingcash = this._closingcash
    this._openingcumcapitalcost = this._closingcumcapitalcost
    this._openingcumdepreciation = this._closingcumdepreciation
  }
}