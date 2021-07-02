class Hudnew{
  constructor(){
    this.element = document.querySelector('hudnew')
  }
  display=(period,amount)=>{
    this.element.innerHTML=`<iconify-icon data-icon="carbon:time-plot"></iconify-icon>${period}
    <iconify-icon data-icon="emojione-v1:money-bag"></iconify-icon>${amount}`
  } 
}