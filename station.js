class Station{
  constructor(path,name,wpn,x,y){
    this.path=path
    this.name=name
    this.wpn = 1*wpn
    this.x= 1*x
    this.y= 1*y
    //this.saveInDB()
  }
  async saveInDB(){
    await saveStationToDB(this.path.PathIdInDB,this.name,this.wpn,this.x,this.y)
  }
}