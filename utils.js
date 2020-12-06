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

function angleBetweenLinesIsOK(x1, y1, x2, y2, x3, y3, MIN_ANGLE) {
  //first line is x1,y1,x2,y2
  //second line is x2,y2,x3,y3
  let la = Math.pow((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2), 0.5)
  let lb = Math.pow((x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2), 0.5)
  let lc = Math.pow((x3 - x1) * (x3 - x1) + (y3 - y1) * (y3 - y1), 0.5)
  let r = MIN_ANGLE * Math.PI/180
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
function FromToTravelDemand(period, cities, cityFrom, cityTo) {
  let cf = cities.city(cityFrom)[0]
  let ct = cities.city(cityTo)[0]
  let cfgr = cf.growthrate
  let ctgr = ct.growthrate

  demand = (2 * cf.population * (1 + period * cfgr) + ct.population * (1 + period * ctgr)) * 0.00001
  if (cf.population >= 90000) {
    demand += ct.travelDestination ? 10 : 5
  }
  if (cf.traveldestination) {
    demand += ct.population > 90000 ? 20 : 10
  }
  return Math.floor(demand)
}
function getClosestCity(cities, x, y) {
  //cycle through all the cities
  let minDistance = 10000000
  let city = ''
  cities.cities.forEach(c => {
    let dist = lineLength(x, y, c.x, c.y)
    if (dist < minDistance) {
      minDistance = dist
      city = c.name
    }
  })
  return city
}
function getClosestCityObject(cities, x, y) {
  //cycle through all the cities
  let city = {}
  // cities.cities.forEach(c => {
  //   let dist = lineLength(x, y, c.x, c.y)
  //   if (dist <= Game.CITY_RADIUS) {
  //     city = c
  //   }
  // })
  for (let c of cities.cities) {
    let dist = lineLength(x, y, c.x, c.y)
    if (dist <= Game.CITY_RADIUS) {
      city = c
      break;
    }
  }
  return city
}

function distanceToClosestCity(cities,x,y){
  //cycle through all the cities
  let minDistance = 10000000
  let city = ''
  cities.cities.forEach(c => {
    let dist = lineLength(x, y, c.x, c.y)
    if (dist < minDistance) {
      minDistance = dist
      city = c.name
    }
  })

  return minDistance
}



function circle(p1, p2, p3, p4) {
  //returns the circle x,y,radius of the 
  //circle passing through p2 and p3 where
  //the two line segments p1,p2 and p3,p4 are
  //tangential to the circle.

  //slope of first line
  let m1 = (p2.y - p1.y) / (p2.x - p1.x);
  //intercept of the perppendicular going through p2
  let c1 = p2.y + (1 / m1) * p2.x;

  let m2 = (p4.y - p3.y) / (p4.x - p3.x);
  //intercept of the perppendicular going through p2
  let c2 = p3.y + (1 / m2) * p3.x;

  //slopes of the respective perpendiculars
  m1 = -1 / m1;
  m2 = -1 / m2;

  //point of intersection of the two perpendiculars
  let x, y
  if (Number.isFinite(m1) && Number.isFinite(m2)) {
    x = (c2 - c1) / (m1 - m2);
    y = m1 * x + c1;
  } else if (!Number.isFinite(m1)) {
    x = (p2.x - p1.x) / 2
    y = m2 * x + c2;
  } else if (!Number.isFinite(m2)){
    x = (p4.x - p3.x) / 2
    y = m1 * x + c1;
  }
  //console.log(`intersection point`);
  //console.log(`${x},${y}`);
  let radius = Math.sqrt((p2.x - x) * (p2.x - x) + (p2.y - y) * (p2.y - y));
  return { x, y, radius };
}

function pointsAlongArc(x, y, r, p1x, p1y, p2x, p2y) {
  console.log(x, y, r, p1x, p1y, p2x, p2y);
  //find all the points along the circumfrence of a circle
  const GAP = 2
  let points = [];
  let n = Math.floor(2 * Math.PI * r / GAP)

  for (let i = 0; i < n; i++) {
    let _x = x + r * Math.cos((((i * 360) / n) * Math.PI) / 180);
    let _y = y + r * Math.sin((((i * 360) / n) * Math.PI) / 180);
    points.push(new Point(_x, _y));
    //console.log(`${i}:${_x},${_y}`);
  }
  //find the array index for point closest to a given point
  let f = (array, x, y) => {
    let min_l = 100000,
      min_i = -1;
    for (let i = 0; i < array.length; i++) {
      let l = Math.sqrt(
        (array[i].x - x) * (array[i].x - x) +
        (array[i].y - y) * (array[i].y - y)
      );
      if (l < min_l) {
        min_l = l;
        min_i = i;
      }
    }
    return min_i;
  };
  let i1 = f(points, p1x, p1y);
  let i2 = f(points, p2x, p2y);
  console.log(i1, i2);
  let finalpoints = [];


  //select point adjacent to p1 in clockwise
  //direction
  let _i1 = i1 + 1;
  if (_i1 === n) _i1 = 0;
  let d1 = lineLength(points[i1].x, points[i1].y, points[i2].x, points[i2].y);
  let d2 = lineLength(points[_i1].x, points[_i1].y, points[i2].x, points[i2].y);
  console.log(`Lengths: ${d1},${d2}`);
  let clockwise = d2 < d1 ? true : false;
  if (clockwise) {
    while (i1 !== i2) {
      //console.log(`Final point: ${points[i1].x},${points[i1].y}`)
      finalpoints.push({ x: points[i1].x, y: points[i1].y });
      i1++;
      if (i1 === n) i1 = 0;
    }
  } else {
    while (i1 !== i2) {
      //console.log(`Final point: ${points[i1].x},${points[i1].y}`)
      finalpoints.push({ x: points[i1].x, y: points[i1].y });
      i1--;
      if (i1 === -1) i1 = n - 1;
    }
  }

  return finalpoints
}
function pointsAlongArcNew(x, y, r, p1x, p1y, p2x, p2y) {
  console.log(x, y, r, p1x, p1y, p2x, p2y);
  //find all the points along the circumfrence of a circle
  const GAP = 2
  let points = [];
  let n = Math.floor(2 * Math.PI * r / GAP)

  // for (let i = 0; i < n; i++) {
  //   let _x = x + r * Math.cos((((i * 360) / n) * Math.PI) / 180);
  //   let _y = y + r * Math.sin((((i * 360) / n) * Math.PI) / 180);
  //   points.push(new Point(_x, _y));
  // }
  //find the 2 points on either side of p1 on the arc
  dtheta = 2*Math.PI/180 //2 degrees in radians
  let newx = null
  let newy = null
  let finalpoints = [];
  let done = true
  do {
    finalpoints.push({x:p1x,y:p1y}) 
    //calculate 2 points on either side of p1 
    let p_1 = {x: p1x + r*dtheta*Math.sin(dtheta),y: p1y + r*dtheta*Math.cos(dtheta)}
    let p_2 = {x: p1x - r*dtheta*Math.sin(*dtheta),y: p1y - r*dtheta*Math.cos(dtheta)}
    //calculate distance from those points to p2 
    let l_1 = lineLength(p_1.x,p_1.y,p2x,p2y)
    let l_2 = lineLength(p_2.x,p_2.y,p2x,p2y)
    if(l_1 < l_2){
      //now p_1 becomes the new p1
      //ensure that p_1 lies between p1 and p2
      if(((p1x <= p_1.x && p_1.x <= p2x) || (p1x >= p_1.x && p_1.x >= p2x)) && ((p1y <= p_1.y && p_1.y <= p2y) || (p1y >= p_1.y && p_1.y >= p2y))){
        p1x = p_1.x
        p1y = p_1.y
        done = false
      }else{
        done=true
      }
    }else{
      if(((p1x <= p_2.x && p_2.x <= p2x) || (p1x >= p_2.x && p_2.x >= p2x)) && ((p1y <= p_2.y && p_2.y <= p2y) || (p1y >= p_2.y && p_2.y >= p2y))){
        p1x = p_2.x
        p1y = p_2.y
        done = false
      }else{
        done=true
      }
    }
  } while (!done);

  
  /* //find the closest point to p1 but between p1 and p2
  let f = (array, p1x, p1y, p2x, p2y) => {
    let pt = {x:null,y:null}
    let distp1p2 = Math.sqrt(
      (p2x - p1x) * (p2x - p1x) +
      (p2y - p1y) * (p2y - p1y)
    );
    let dist = Infinity
    for (let i = 0; i < array.length; i++) {
      let l = Math.sqrt(
        (array[i].x - p1x) * (array[i].x - p1x) +
        (array[i].y - p1y) * (array[i].y - p1y)
      );
      let distp2 = Math.sqrt(
        (array[i].x - p2x) * (array[i].x - p2x) +
        (array[i].y - p2y) * (array[i].y - p2y)
      );
      if (l < dist && distp2 < distp1p2) {
        pt = {x:array[i].x,y:array[i].y}
        dist = l 
      }
    }
    return pt;
  };

  let finalpoints = [];
  finalpoints.push({x:p1x,y:p1y}) 
  while (p1x != null && p2x != null) {
    let nextPoint = f(points,p1x,p1y,p2x,p2y) 
    p1x = nextPoint.x
    p1y = nextPoint.y
  }
 */
  return finalpoints
}

function play( audio, time_in_milisec){
  //audio.loop = true;
  audio.play();
  setTimeout(() => { audio.pause(); }, time_in_milisec);
}