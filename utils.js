function lineLength(x1, y1, x2, y2) {
  return Math.pow((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2), 0.5)
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

function findPointOnCircle(x, y, r, extx, exty) {
  let extl = lineLength(x, y, extx, exty);
  //on line connecting x,y,extx.exty we get the point
  //by prorating
  let xCirc = x + ((extx - x) * r) / extl;
  let yCirc = y + ((exty - y) * r) / extl;
  return { x: xCirc, y: yCirc };
}

function pointsAlongArcNew(x, y, r, p1x, p1y, p2x, p2y, ctx) {

  //display a circle
  ctx.beginPath();
  ctx.strokeStyle = "rgb(0,0,0)";
  ctx.lineWidth = 0.1
  ctx.moveTo(x+r, y);
  ctx.arc(x, y, r, 0, 2*Math.PI);
  ctx.stroke();

  let points = [];
  let d = 3;
  let done = true;
  do {
      // points.push({ x: p1x, y: p1y });
      // ctx.beginPath();
      // ctx.fillStyle = "rgb(0,0,0)";
      // ctx.moveTo(p1x, p1y);
      // ctx.arc(p1x, p1y, 1, 0, Math.PI);
      // ctx.fill();

      let m = (y - p1y) / (x - p1x);
      let theta = Math.atan(m);
      // console.log(
      //     `num:${num},theta:${theta}, S:${Number.parseFloat(d * Math.sin(theta)).toFixed(3)}, C:${Number.parseFloat(d * Math.cos(theta)).toFixed(3)}`
      // );
      //calculate 2 points on either side of p1
      let p_1 = { x: p1x + d * Math.sin(theta), y: p1y - d * Math.cos(theta) };
      let p_2 = { x: p1x - d * Math.sin(theta), y: p1y + d * Math.cos(theta) };
      //calculate distance from those points to p2
      let l_1 = lineLength(p_1.x, p_1.y, p2x, p2y);
      let l_2 = lineLength(p_2.x, p_2.y, p2x, p2y);
      if (l_1 <= l_2) {
          //now p_1 becomes the new p1
          //ensure that p_1 lies between p1 and p2
          // console.log(
          //     num,
          //     p_1.x,
          //     p_1.y,
          //     "l_1",
          //     lineLength(p_1.x, p_1.y, p2x, p2y) - d
          // );
          if (lineLength(p_1.x, p_1.y, p2x, p2y) > d) {
              //find the point a new point on the findPointOnCircle
              let p = findPointOnCircle(x, y, r, p_1.x, p_1.y);
              p1x = p.x;
              p1y = p.y;
              done = false;
          } else {
              done = true;
          }
      } else {
          //now p_2 becomes the new p1
          // console.log(
          //     num,
          //     p_2.x,
          //     p_2.y,
          //     "l_2",
          //     lineLength(p_2.x, p_2.y, p2x, p2y) - d
          // );
          if (lineLength(p_2.x, p_2.y, p2x, p2y) > d) {
              let p = findPointOnCircle(x, y, r, p_2.x, p_2.y);
              p1x = p.x;
              p1y = p.y;
              done = false;
          } else {
              done = true;
          }
      }
      if (!done) {
          points.push({ x: p1x, y: p1y });
          ctx.beginPath();
          ctx.fillStyle = "rgb(255,0,0)";
          ctx.moveTo(p1x, p1y);
          ctx.arc(p1x, p1y, 1, 0, Math.PI);
          ctx.fill();
      }
  } while (!done);

  return points
}

//replaced with another version. Renamed this to _previous
function pointsAlongArcNew_previous(x, y, r, p1x, p1y, p2x, p2y) {
  
  console.log(x, y, r, p1x, p1y, p2x, p2y);

  //find the 2 points on either side of p1 on the arc
  let dtheta = Math.PI/90 //2 degrees in radians
  let arclength = dtheta*r
  let finalpoints = [];
  let done = true
  do {
    //finalpoints.push({x:p1x,y:p1y}) 
    let m = (y-p1y)/(x-p1x)
    let theta = Math.atan(m)
    //calculate 2 points on either side of p1 
    let p_1 = {x: p1x + arclength*Math.sin(theta),y: p1y - arclength*Math.cos(theta)}
    let p_2 = {x: p1x - arclength*Math.sin(theta),y: p1y + arclength*Math.cos(theta)}
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
    finalpoints.push({x:p1x,y:p1y}) 
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
function getFeature(ctx,x,y){
  let feature = Game.FEATURE_LAND
  let imgData = ctx.getImageData(x, y, 1, 1)
  if(imgData.data[0]==77 && imgData.data[0]==77 && imgData.data[0]==247){
    feature = Game.FEATURE_WATER
  }else if(imgData.data[0]==255 && imgData.data[0]==255 && imgData.data[0]==255){
    feature = Game.FEATURE_TUNNEL
  }
  return feature
}