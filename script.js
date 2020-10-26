const canvas = document.querySelectorAll('.canvas1')[0]
canvas.width=window.innerWidth
canvas.height=window.innerHeight
console.log(canvas)
const ctx = canvas.getContext('2d')
ctx.lineWidth=1

let final=false

let currentMousePosition = {
    x:0,
    y:0
}
let lastClick={
    x:0,
    y:0
}
let path=[]

canvas.addEventListener('click',function(event){
    lastClick.x = event.offsetX
    lastClick.y = event.offsetY
    path.push({x:lastClick.x,y:lastClick.y})
    
    // ctx.save()
    // ctx.fillStyle='rgb(255, 100, 100)'
    // ctx.moveTo(lastClick.x ,lastClick.y)
    // ctx.arc(lastClick.x ,lastClick.y,2,0,2*Math.PI,true)
    // ctx.fill()
    // ctx.restore()
    // if(drawDottedLine==true){
    //     path.push({x:lastClick.x,y:lastClick.y})
    // }
})

document.onmousemove = function(event){
    currentMousePosition.x = event.offsetX
    currentMousePosition.y = event.offsetY
    // if(drawDottedLine===true && (path.length!=0)){
    //     ctx.clearRect(0,0,canvas.width,canvas.height)
    //     ctx.lineWidth=1
    //     ctx.setLineDash=[3,5,3]
    //     ctx.strokeStyle='rgb(255, 255, 255)';
    //     ctx.beginPath()
    //     console.log(lastClick.x,lastClick.y)
    //     ctx.moveTo(lastClick.x,lastClick.y)
    //     ctx.lineTo(event.offsetX,event.offsetY)
    //     ctx.stroke()
    // }
}
document.onkeypress = function(event){

    // console.log(event)
    // if(event.key=='a'){
    //     drawDottedLine=true
    // }

    if(event.key=='f'){
        final=true
        console.log(path)
    }else if(event.key=='Esc'){
        final=true
        path.pop()
    }else{
        final=false
        path=[]
    }

};

function drawFinalPath(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.beginPath()
    ctx.strokeStyle='rgb(255, 255, 255)';
    ctx.setLineDash([5,15])

    if(path.length>0){
        ctx.moveTo(path[0].x,path[0].y)
        for(let i = 1;i<path.length;i++){
            ctx.lineTo(path[i].x,path[i].y)
        }
        if(!final){
            ctx.lineTo(currentMousePosition.x ,currentMousePosition.y)
        }
        ctx.stroke()
    }

    let p1x,p1y,p2x,p2y,cpx,cpy
    if(path.length>2){
        ctx.strokeStyle="rgb(100,100,255)"
        ctx.beginPath()
        for(let i = 0;i<path.length-2;i++){
            p1x=(path[i].x+path[i+1].x)/2
            p1y=(path[i].y+path[i+1].y)/2
            p2x=(path[i+1].x+path[i+2].x)/2
            p2y=(path[i+1].y+path[i+2].y)/2
            ctx.moveTo(p1x,p1y)
            ctx.quadraticCurveTo(path[i+1].x,path[i+1].y,p2x,p2y)
        }
        ctx.stroke()
    }
}

const performAnimation = () => {
    request = requestAnimationFrame(performAnimation)
    drawFinalPath()
}

performAnimation()