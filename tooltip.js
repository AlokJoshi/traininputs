class ToolTip{
  constructor(tooltip){
    this.tooltip = tooltip
    // this.tooltip.style.padding='5px'
    // this.tooltip.style.color='rgba(255,0,255,.5)'
    // this.tooltip.style.fontSize='12px'
    // this.tooltip.style.zIndex = 1
    // this.tooltip.style.width = '100px'
    // this.tooltip.style.backgroundColor='rgba(212,212,212,0.7)'
    // this.tooltip.style.borderRadius='4px'
    // this.tooltip.style.display='block' 
  }
  display(city,waiting){
    this.tooltip.style.top=`${city.y}px`
    this.tooltip.style.left=`${city.x}px`
    let txt = `Waiting: `
    waiting.forEach(city => {
      txt+=`${city.to}=${Math.floor(city.passengers)} `  
    }); 
    this.tooltip.innerHTML = txt
    this.tooltip.style.display='block' 
  }
  clearDisplay(){
    this.tooltip.style.display='none' 
  }
}