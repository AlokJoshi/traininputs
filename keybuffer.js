class KeyBuffer {
  constructor() {
    this.kb = ''
  }
  addKey(key) {
    if (this.kb == '') {
      switch (key) {
        case 'r':
        case 'R':
          if (state != RUNNING_STATE) {
            previous_state = state
            state = ROUTE_EDITING_STATE
          }
          break;
        case 's':
        case 'S':
          if (state != RUNNING_STATE) {
            previous_state = state
            state = STATION_EDITING_STATE
          }
          break;
        case 't':
        case 'T':
          if (state != RUNNING_STATE) {
            previous_state = state
            state = TRAIN_EDITING_STATE
          }
          break;
        case 'p':
        case 'P':
          if (state == RUNNING_STATE) {
            previous_state = state
            state = PAUSED_STATE
          }
          break;
        case 'g':
        case 'G':
          previous_state = state
          state = RUNNING_STATE
          break;
        case 'f':
        case 'F':
        case 'd':
        case 'D':
        case 'a':
        case 'A':
        case ' ':
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
            console.log('delete point')
            window.dispatchEvent(new Event('deletepoint',{
              detail:{

              }
            }))
            break;
            
          case 'as':
            console.log('add station');
            window.dispatchEvent(new Event('addstation',{
              detail:{

              }
            }))              
            break;
          case 'ds':
            console.log('delete station');
            window.dispatchEvent(new Event('deletestation',{
              detail:{

              }
            }))              
            break;
          case 'sg':
            console.log('start game');
            window.dispatchEvent(new Event('startgame',{
              detail:{

              }
            }))              
            break;
          case 'pg':
            console.log('pause game');
            window.dispatchEvent(new Event('pausegame',{
              detail:{

              }
            }))                
            break;
          
          default:
            console.log(`keyCombination: ${keyCombination} is not recognized`);
            this.kb=''
        } */
    }

  }
}