class Cities{
    constructor(){
      this._cities = new Array()
      this._cities.push(new City('Mumba',125,100,100000,true))
      this._cities.push(new City('Kata',1050,75,150000,false))
      this._cities.push(new City('Haybad',1475,175,75000,false))
      this._cities.push(new City('Dore',700,250,50000,false))
      this._cities.push(new City('Purnapur',450,500,80000,false))
      this._cities.push(new City('Oooby',925,475,30000,true))
      this._cities.push(new City('Poa',1625,475,100000,true))
      this._cities.push(new City('Mannai',700,950,90000,false))
      this._cities.push(new City('Lochin',1200,925,40000,true))
      this._cities.push(new City('Bangro',1500,650,60000,false))
    }
    add(city){
      this._cities.push(city)
    }
    city(citystring){
      return this._cities.filter((city)=>city.name===citystring)
    }
    draw(ctx){
      this._cities.forEach(c=>c.draw(ctx))
    }
    get cities(){
      return this._cities
    }
}