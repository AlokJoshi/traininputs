class Chat{
  constructor(socket){
    this.socket = socket
    this.message = document.getElementById('message')
    this.btnmessage = document.getElementById('btnmessage')
    this.btnmessage.addEventListener('click', ()=>{
      this.send(localStorage.getItem('email') ,message.value)
      this.message.value=""
    })
    this.inputelement = document.getElementById('message')
    this.inputelement.addEventListener('keypress',(e)=>{
      if(e.key=='Enter'){
        this.btnmessage.click()
      }
      e.stopPropagation()
    })
    this.inputelement.addEventListener('keyup',(e)=>{
      e.stopPropagation()
    })
    this.inputelement.addEventListener('keydown',(e)=>{
      e.stopPropagation()
    })
    this.messages = document.getElementById('messages')
    this.socket.on('chat',(msg)=>{
      this.display(msg)
    })
  }
  send = (email,message)=>{
    let d=new Date()
    this.socket.emit('chat',{
      email:email,
      time:`${d.getUTCHours()}:${d.getUTCMinutes()} GMT`,
      message:message
    })
  }
  display = (msg)=>{
    //console.log(JSON.stringify(msg)) 
    let myemail = localStorage.getItem('email')
    //console.log(myemail,msg.email)
    this.messages.innerHTML += `<p>
                                <span id="email"> 
                                <span class="iconify" data-icon="carbon:email" data-inline="true"></span>
                                ${msg.email} </span>
                                <span id="time">${msg.time}</span> ${msg.message}
                                ${myemail!=msg.email?'<span class="iconify" data-icon="akar-icons:thumbs-up" data-inline="true"></span><span class="iconify" data-icon="akar-icons:thumbs-down" data-inline="true"></span></span><span class="iconify" data-icon="gridicons:spam" data-inline="true"></span>':''}
                                </p>` 
  }
}