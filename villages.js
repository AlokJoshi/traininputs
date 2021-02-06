class Villages {
  constructor() {
    this._villages = []
    this._villages.push(new Village('Billy',840,50,1))
    // this._villages.push(new Village('Kata',1090,560,150000,false,0.001,8,500))
    // this._villages.push(new Village('Haybad',840,120,75000,false,0.003,5,2000))
    // this._villages.push(new Village('Dore',380,150,50000,false,0.004,3,100))
    // this._villages.push(new Village('Purnapur',240,290,80000,false,0.001,3,100))
    // this._villages.push(new Village('Ooby',580,300,30000,true,0.005,6,500))
    // this._villages.push(new Village('Poa',1020,290,100000,true,0.006,5,2000))
    // this._villages.push(new Village('Mannai',440,610,90000,false,0.007,9,1000))
    // this._villages.push(new Village('Lochin',750,590,40000,true,0.003,6,500))
    // this._villages.push(new Village('Bangro',940,410,60000,false,0.010,10,300))
  }
  add(village){
    this._villages.push(village)
  }
  village(villagename){
    return this._villages.filter((village)=>village.name===villagename)
  }
  draw(period,ctx){
    this.villagesInPeriod(period).forEach(c=>c.draw(ctx))
  }
  animate(period,ctx){
    this.villagesInPeriod(period).forEach(c=>c.animate(ctx))
  }
  villagesInPeriod(period){
    return this._villages.filter(village=>village.period<=period)
  }
}