function lineLength(x1, y1, x2, y2) {
    return Math.pow((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2), 0.5)
}

function angleBetweenLinesIsOK2(x1, y1, x2, y2, x3, y3) {
    //first line is x1,y1,x2,y2
    //second line is x2,y2,x3,y3
    const dist = 10
    let la = Math.pow((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2), 0.5)
    let lb = Math.pow((x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2), 0.5)
  
    let xa = x2 - (x2 - x1) * dist / la
    let ya = y2 - (y2 - y1) * dist / la
  
    let xb = x2 - (x2 - x3) * dist / lb
    let yb = y2 - (y2 - y3) * dist / lb
  
    let d = Math.pow((xa - xb) * (xa - xb) + (ya - yb) * (ya - yb), 0.5)
  
    return d > 2 * dist * Math.cos(MIN_ANGLE * Math.PI / 180)
  }

  function angleBetweenLinesIsOK(x1, y1, x2, y2, x3, y3) {
    //first line is x1,y1,x2,y2
    //second line is x2,y2,x3,y3
    let la = Math.pow((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2), 0.5)
    let lb = Math.pow((x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2), 0.5)
    let lc = Math.pow((x3 - x1) * (x3 - x1) + (y3 - y1) * (y3 - y1), 0.5)
    let r = MIN_ANGLE * 180 / Math.PI
    let dmin = Math.pow(la * Math.sin(r) * la * Math.sin(r) + (lb - la * Math.cos(r)) * (lb - la * Math.cos(r)), 0.5)
  
    return lc >= dmin
  }
  function angleBetweenLines(x1, y1, x2, y2, x3, y3) {
    //first line is x1,y1,x2,y2
    //second line is x2,y2,x3,y3
    let xDiff1 = (x1 - x2)
    if (xDiff1 === 0) xDiff1 = 0.0000001
    let xDiff2 = (x2 - x3)
    if (xDiff2 === 0) xDiff2 = 0.0000001
    let m1 = (y1 - y2) / xDiff1
    let m2 = (y2 - y3) / xDiff2
    let factor = (m2 - m1) / (1 + m1 * m2)
    let angle = Math.atan(factor) * 180 / Math.PI
    let adjustedAngle = factor < 0 ? angle : 180 + angle
    console.log(`factor is ${factor}, angle is ${angle}, adjustedAngle is ${adjustedAngle}`)
    return adjustedAngle
  }
  function FromToTravelDemand(cities,cityFrom,cityTo){
    let cf = cities.city(cityFrom)[0]
    let ct = cities.city(cityTo)[0]
    demand = (2*cf.population+ct.population)*0.00001
    if(cf.population>=90000){
      demand+=ct.travelDestination?10:0
    }
    if(cf.traveldestination){
      demand+=ct.population>90000?2:1
    }
    return Math.floor(demand)
  }
  function getClosestCity(x,y){
    //cycle through all the cities
    let minDistance=10000000
    let city=''
    cities.cities.forEach(c=>{
      let dist = lineLength(x,y,c.x,c.y)
      if(dist<minDistance){
        minDistance=dist
        city=c.name
      }
    })
    return city
  }