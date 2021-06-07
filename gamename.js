class GameName{
  constructor(oldname){
    this.oldname = oldname
    this.inputelement = document.querySelector('#inputpopup')
    this.width = 400
    this.height = this.inputelement.height
    //this.top = (window.innerHeight-this.height)/2
    this.left = (window.innerWidth-this.width)/2 
    //this.inputelement.style = `display:grid;top:${this.top}px;left:${this.left}px;width:${this.width}px;height:${this.height}px`
    this.inputtext = document.getElementById('inputtext')
    this.inputtext.placeholder = oldname
    this.okbutton = document.getElementById('inputok')
    this.cancelbutton = document.getElementById('inputcancel')
    this.okbutton.addEventListener('click',this.rename)
    this.cancelbutton.addEventListener('click',this.cancel)
  }
  show = () => {
    this.inputelement.style.left = `${this.left}px`
    this.inputelement.style.top = `${this.top}px`
    this.inputelement.style.width = `${this.width}px`
    //this.inputelement.style.height = `${this.height}px`
    this.inputelement.style.display = "grid"
    this.inputelement.style.visibility = "visible"
  }
  rename = () => {
    alert(this.inputtext.value)
    //do some async operation
    setTimeout(this.hide,2000)
  }
  cancel = () => {
    this.hide()
  }
  hide = () => {
    this.inputelement.style = `display:none`
  }
}