class ToolTip{
  constructor(tooltip){
    this.tooltip = tooltip
    this.tooltip.style.color='rgba(0,0,255,.5)'
    this.tooltip.style.fontSize='12px'
    this.tooltip.style.zIndex = 1
    this.tooltip.style.width = '100px'
    this.tooltip.style.backgroundColor='rgba(212,212,212,0.7)'
    this.tooltip.style.borderRadius='2px'
  }
  display(city,waiting){
    this.tooltip.style.top=`${city.y}px`
    this.tooltip.style.left=`${city.x}px`
    let txt = `Pop: ${city.population} Waiting: ${waiting}, Growth Rate: ${city.growthrate}, Travel Destination: ${city.traveldestination?'Yes':'No'}`
    this.tooltip.innerHTML = txt
  }
  clearDisplay(){
    this.tooltip.innerHTML = ""  
  }
}