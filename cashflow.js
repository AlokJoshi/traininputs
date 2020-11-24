class CashFlow {
  constructor(game,openingcash,openingcumcapitalcost,openingcumdepreciation) {
    this.game = game
    this._openingcash = openingcash
    this._openingcumcapitalcost = openingcumcapitalcost
    this._openingcumdepreciation = openingcumdepreciation
    this._capitalcost = 0
    this._ticketsales = 0
    this._depreciation = 0
    this._trackcost = 0
    this._stationcost = 0
    this._enginecost = 0
    this._coachcost = 0
    this._runningcost = 0
    this._maintenancecost = 0
    this._profit = 0
    this._tax = 0
    this._patd = 0
    this._closingcumcapitalcost = 0
    this._closingcumdepreciation = 0
    this._closingcash = 0
  }
  set ticketsales(value){
    this._ticketsales+=value
  }
  set trackcost(value){
    this._trackcost+=value
  }
  set stationcost(value){
    this._stationcost+=value
  }
  set coachcost(value){
    this._coachcost+=value
  }
  get runningcost(){
    this.update()
    return this._runningcost
  }
  get maintenancecost(){
    this.update()
    this._maintenancecost
  }
  get profit(){
    this.update()
    return this._profit
  }
  get tax(){
    this.update()
    return this._tax
  }
  get patd(){
    this.update()
    return this._patd
  }
  get closingcash(){
    this.update()
    return this._closingcash
  }
  update(){


    //update the capital cost
    this._capitalcost = this._trackcost + this._stationcost + this._coachcost + this._enginecost 
    
    //update the cum capital cost
    this._closingcumcapitalcost = this._openingcumcapitalcost + this._capitalcost

    //the period depreciation is calculated on the closingcumcapitalcost on the assumption
    //that the capital cost is incurred in the beginning of the period but only on the remainder
    //value
    let remaindervalue = this._closingcumcapitalcost - this._openingcumdepreciation
    this._depreciation = remaindervalue * 1/200
    this._closingcumdepreciation = this._openingcumdepreciation + this._depreciation

    //maintenance cost is based on the amount of capital cost 
    this._maintenancecost=0.01 * this._closingcumcapitalcost

    //running cost is based on the total distance travelled by all the trains
    this._runningCost = this.game.paths.paths.reduce((cum,p)=>cum+p.train.runningCostPerTimePeriod,0)
    
    //profit
    this._profit = this._ticketsales - this._runningcost - this._maintenancecost - this._depreciation

    //taxes
    this._tax = this._profit * 0.15

    //profit after taxes and depreciation
    this._patd = this._profit - this._tax

    //closing cash
    this._closingcash = this._openingcash + this._patd + this._depreciation - this._capitalcost
  }
}