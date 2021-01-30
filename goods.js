class Goods extends Traffic{
  constructor() {
    super()
  }
  // get goods(){
  //   return this.info  
  // }  
  addGoods(from,to,num){
    this.addTraffic(from,to,num)
  } 
  subtractGoods(from,to,num) {
    this.subtractTraffic(from,to,num)  
  }
}