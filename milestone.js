class Milestone{
  constructor(socket){
    this.milestones = document.getElementById('milestones')
    this.socket = socket
    this.socket.on('milestone',(msg)=>{
      this.display(msg)
    })
  }
  send = (email,milestone)=>{
    let d=new Date()
    this.socket.emit('milestone',{
      email:email,
      time:`${d.getUTCHours()}:${d.getUTCMinutes()} GMT`,
      milestone:milestone
    })
  }
  display = (msg)=>{
    console.log(JSON.stringify(msg)) 
    let myemail = localStorage.getItem('email')
    if(myemail!=msg.email){
      this.milestones.innerHTML += `<p>
      <span id="email"> 
      <span class="iconify" data-icon="carbon:email" data-inline="true"></span>
      ${msg.email} </span>
      <span id="time">${msg.time}</span> ${msg.milestone}
      </p>` 
    }
  }
}