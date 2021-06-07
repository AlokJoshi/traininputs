class Popup {
  constructor(time,soundon,pop) {
    this.time = time;
    this.top = (window.innerHeight-200)/2
    this.left = (window.innerWidth-200)/2 
    this.popupwidth = 300
    this.popupheigth = 200
    this.soundon = soundon
    this.pop = pop
    return this
  }
  show=(text)=> {
    if(this.soundon) this.pop.play()
    let popup = document.querySelector("#popup");
    popup.style.left = `${this.left}px`
    popup.style.top = `${this.top}px`
    popup.style.width = `${this.popupwidth}px`
    popup.style.height = `${this.popupheight}px`
    let popupbody = document.querySelector(".popupbody");
    popupbody.innerHTML = text;
    popup.style.display = "grid"
    popup.style.visibility = "visible";
    
    setTimeout(() => {
      popup.style.visibility = "hidden";
    }, this.time);
  }
}