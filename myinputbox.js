class Myinputbox{
  //constructor(game,placeholder){
  constructor(title,inputexplanation,placeholder,callback){
    //this.game = game
    this.inputelement = document.querySelector('#inputpopup')
    this.inputtitle = document.querySelector('#inputtitle')
    this.inputexplanation = document.querySelector('#inputexplanation')
    this.placeholder = placeholder
    this.width = 400
    this.left = (window.innerWidth-this.width)/2 
    this.ok = true
    this.newvalue = null
    this.callback = callback //callback expects this.ok and this.newvalue

    this.inputexplanation.innerHTML=inputexplanation
    this.inputtitle.innerHTML = title
    this.inputtext = document.getElementById('inputtext')
    this.inputtext.placeholder = this.placeholder
    this.okbutton = document.getElementById('inputok')
    this.cancelbutton = document.getElementById('inputcancel')
    this.okbutton.addEventListener('click',this.rename)
    this.cancelbutton.addEventListener('click',this.cancel)
    this.inputelement.addEventListener('keypress',(e)=>{
      e.stopPropagation()
    })
    this.inputelement.addEventListener('keyup',(e)=>{
      e.stopPropagation()
    })
    this.inputelement.addEventListener('keydown',(e)=>{
      e.stopPropagation()
    })
    this.inputelement.style.left = `${this.left}px`
    this.inputelement.style.top = `${this.top}px`
    this.inputelement.style.width = `${this.width}px`
    this.inputelement.style.display = "grid"
    this.inputelement.style.visibility = "visible"
  }
  
  rename = () => {
    this.callback(true,this.inputtext.value)
    this.hide()
  }
  
  cancel = () => {
    this.callback(false,null)
    this.hide()
  }

  hide = () => {
    this.inputelement.style = `display:none`
  }
}