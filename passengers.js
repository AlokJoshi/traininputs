class Passengers{
  constructor(){
    this.info = new Array()
  }
  get passengers(){
    return this.info
  }
  numAvailable(from,to){
    let i = this.info.findIndex((x)=>x.from==from && x.to==to) 
    if(i>=0){
      return this.info[i].passengers  
    }else{
      return 0
    } 
  }
  addPassengers(from,to,num){
    let i = this.info.findIndex((x)=>x.from==from && x.to==to)  
    if(i>=0){
      this.info[i].passengers+=num
    }else{
      this.info.push({
        from,
        to,
        passengers:num
      })
    }
  }
  subtractPassengers(from,to,num){
    let i = this.info.findIndex((x)=>x.from==from && x.to==to) 
    let numSubtracted 
    if(i>=0){
      numSubtracted = Math.min(this.info[i].passengers,num)
      this.info[i].passengers-=numSubtracted
    }
    return numSubtracted
  }
}