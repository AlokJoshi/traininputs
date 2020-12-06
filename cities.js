class Cities{
    constructor(){
      this._cities = new Array()
      this._cities.push(new City('Mumba',80,60,100000,true,0.002))
      this._cities.push(new City('Kata',1090,590,150000,false,0.001))
      this._cities.push(new City('Haybad',840,120,75000,false,0.003))
      this._cities.push(new City('Dore',380,150,50000,false,0.004))
      this._cities.push(new City('Purnapur',240,290,80000,false,0.001))
      this._cities.push(new City('Ooby',580,300,30000,true,0.005))
      this._cities.push(new City('Poa',1020,290,100000,true,0.006))
      this._cities.push(new City('Mannai',440,610,90000,false,0.007))
      this._cities.push(new City('Lochin',750,590,40000,true,0.003))
      this._cities.push(new City('Bangro',940,410,60000,false,0.010))
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