class Cities{
    constructor(){
      this._cities = new Array()
      this._cities.push(new City('Mumba',125,100,100000,true,0.002))
      this._cities.push(new City('Kata',1050,75,150000,false,0.001))
      this._cities.push(new City('Haybad',1475,175,75000,false,0.003))
      this._cities.push(new City('Dore',700,250,50000,false,0.004))
      this._cities.push(new City('Purnapur',450,500,80000,false,0.001))
      this._cities.push(new City('Oooby',925,475,30000,true,0.005))
      this._cities.push(new City('Poa',1625,475,100000,true,0.006))
      this._cities.push(new City('Mannai',700,950,90000,false,0.007))
      this._cities.push(new City('Lochin',1200,925,40000,true,0.003))
      this._cities.push(new City('Bangro',1500,650,60000,false,0.010))
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
    getClosestCity(x,y){
      let d=50
      let city=null
      this._cities.forEach(c=>{
        let l = lineLength(x,y,c.x,c.y)
        if(l<d){
          city=c
        }
      })
      return city
    }
    get cities(){
      return this._cities
    }
}