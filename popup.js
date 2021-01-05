class Popup {
  constructor(text, top, left, width, height, time,soundon,pop) {
    this.text = text;
    this.time = time;
    this.top = top 
    this.left = left 
    this.width = width 
    this.height = height 
    this.popupwidth = 200
    this.popupheigth = 300
    this.soundon = soundon
    this.pop = pop
    return this
  }
  show=()=> {
    if(this.soundon) this.pop.play()
    let popup = document.querySelector("#popup");
    popup.style.left = `${this.width-this.popupwidth}px`
    popup.style.top = `0px`
    // popup.style.left = `${this.left+this.width/2-this.popupwidth/2}px`
    // popup.style.top = `${this.top+ this.height/2-this.popupheigth/2}px`
    //console.log(popup.style.left,popup.style.top)
    let popupbody = document.querySelector(".popupbody");
    popupbody.innerHTML = this.text;
    popup.style.display = "grid"
    popup.style.visibility = "visible";
    setTimeout(() => {
      popup.style.visibility = "hidden";
    }, this.time);
  }
}