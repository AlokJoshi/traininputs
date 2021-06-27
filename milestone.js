class Milestone{
  constructor(socket,email){
    this.milestones = document.getElementById('milestones')
    this.socket = socket
    this.email = email
    this.socket.on('milestone',(msg)=>{
      this.display(msg)
    })
  }
  send = (period,milestone)=>{
    let d=new Date()
    this.socket.emit('milestone',{
      email:this.email,
      time:`${d.getUTCHours()}:${d.getUTCMinutes()} GMT`,
      milestone:`Pd:${period}:${milestone}`
    })
  }
  display = (msg)=>{
    console.log(JSON.stringify(msg)) 
    //if(this.email=msg.email){
      this.milestones.innerHTML += `<p>
      <span id="email"> 
      <span class="iconify" data-icon="carbon:email" data-inline="true"></span>
      ${msg.email} </span>
      <span id="time">${msg.time}</span> ${msg.milestone}
      </p>` 
    //}
  }
}