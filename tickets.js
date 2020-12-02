class Tickets {
  constructor(travel_cost_per_unit_distance) {
    this.info = []
    //calculate distance between each city to each other city
    let cities = new Cities()
    cities.cities.forEach(cFrom => {
      cities.cities.forEach(cTo => {
        let distance = lineLength(cFrom.x,cFrom.y,cTo.x,cTo.y)
        distance = Math.pow(distance,Game.DISTANCE_FACTOR)
        let ticket = Math.round(distance*travel_cost_per_unit_distance/10)*10
        this.info.push({
          from:cFrom.name,
          to:cTo.name,
          ticket:ticket
        })
        //console.log(cFrom.name,cTo.name,ticket)
      })
    });
  }
  get tickets(){
    return this.info
  }
  ticket(from,to){
    return this.info.find(item=>
      item.from==from && item.to==to
    ).ticket
  }
}