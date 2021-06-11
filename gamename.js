class Gamename{
  constructor(game,oldname){
    this.game = game
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
    this.inputelement.addEventListener('keypress',(e)=>{
      e.stopPropagation()
    })
    this.inputelement.addEventListener('keyup',(e)=>{
      e.stopPropagation()
    })
    this.inputelement.addEventListener('keydown',(e)=>{
      e.stopPropagation()
    })
  }
  show = () => {
    this.inputelement.style.left = `${this.left}px`
    this.inputelement.style.top = `${this.top}px`
    this.inputelement.style.width = `${this.width}px`
    this.inputelement.style.display = "grid"
    this.inputelement.style.visibility = "visible"
  }
  rename = async () => {
    await updateGameNameInDB(this.game.gameid, this.inputtext.value)
    this.hide()
    this.game.gamename = this.inputtext.value
    this.game.state=this.game.previousstate
    if(this.game.state==Game.RUNNING_STATE) this.game.animate()
  }
  cancel = () => {
    this.hide()
    this.game.state=this.game.previousstate
    if(this.game.state==Game.RUNNING_STATE) this.game.animate()
  }
  hide = () => {
    this.inputelement.style = `display:none`
  }
}