class Station{
  constructor(path,name,wpn,x,y){
    this.path=path
    this.name=name
    this.wpn = wpn
    this.x=x
    this.y=y
    //this.saveInDB()
  }
  async saveInDB(){
    await saveStationToDB(this.path.PathIdInDB,this.name,this.wpn,this.x,this.y)
  }
}