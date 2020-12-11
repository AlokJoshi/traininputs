class KeyBuffer {
  constructor(game) {
    this.kb = ''
    this.game=game
  }
  addKey(key) {
    if (this.kb == '') {
      switch (key) {
        case 'r':
        case 'R':
          if (this.game.state != Game.RUNNING_STATE) {
            this.game.lastClick.x=null
            this.game.lastClick.y=null
            this.game.previous_state = this.game.state
            this.game.state = Game.ROUTE_EDITING_STATE
          }
          break;
        case 't':
        case 'T':
          if (this.game.state != Game.RUNNING_STATE) {
            this.game.previous_state = this.game.state
            this.game.state = Game.TRAIN_EDITING_STATE
          }
          break;
        case 'p':
        case 'P':
          if (this.game.state == Game.RUNNING_STATE) {
            this.game.previous_state = this.game.state
            this.game.state = Game.PAUSED_STATE
          }
          break;p
        case 'g':
        case 'G':
          this.game.ctx_routedesign.clearRect(0,0,this.game.routedesign.width,this.game.routedesign.height)
          this.game.previous_state = this.game.state
          this.game.state = Game.RUNNING_STATE
          break;
        case 'f':
        case 'F':
        case 'd':
        case 'D':
        case 'a':
        case 'A':
        case 'n':
        case 'N':
        case 'w':
        case 'W':
        case ' ':
        case '+':
        case '-':
        case 'space':
          break;
        default:
          alert(`this key '${key}' is not recognized`)
          break;
      }
    } else if (this.kb != '') {

      /*   //check the key combination to see if the two keys make
        //a valid combination
        let keyCombination = this.kb+key
        switch (keyCombination) {
          case 'at':
            window.dispatchEvent(new Event('addtrack',{
              detail:{

              }
            }))
            break;
          case 'dt':
            window.dispatchEvent(new Event('deletetrack',{
              detail:{

              }
            }))
            break;
          case 'dp':
            window.dispatchEvent(new Event('deletepoint',{
              detail:{

              }
            }))
            break;
            
          case 'as':
            window.dispatchEvent(new Event('addstation',{
              detail:{

              }
            }))              
            break;
          case 'ds':
            window.dispatchEvent(new Event('deletestation',{
              detail:{

              }
            }))              
            break;
          case 'sg':
            window.dispatchEvent(new Event('startgame',{
              detail:{

              }
            }))              
            break;
          case 'pg':
            window.dispatchEvent(new Event('pausegame',{
              detail:{

              }
            }))                
            break;
          
          default:
            this.kb=''
        } */
    }

  }
}