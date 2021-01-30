function lineLength(x1, y1, x2, y2) {
  return Math.pow((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2), 0.5)
}

function angleBetweenLinesIsOK(x1, y1, x2, y2, x3, y3, MIN_ANGLE) {
  //first line is x1,y1,x2,y2
  //second line is x2,y2,x3,y3
  let la = Math.pow((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2), 0.5)
  let lb = Math.pow((x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2), 0.5)
  let lc = Math.pow((x3 - x1) * (x3 - x1) + (y3 - y1) * (y3 - y1), 0.5)
  let r = MIN_ANGLE * Math.PI / 180
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

//todo: this function may not be needed
function FromToGoodsDemand(period, cities, cityFrom, cityTo) {
  let cf = cities.city(cityFrom)[0]
  let ct = cities.city(cityTo)[0]
  let cfgr = cf.growthrate
  let ctgr = ct.growthrate
  let goodsdemand = ct.goodsdemand

  demand = (2 * cf.population * (1 + period * cfgr) + ct.population * (1 + period * ctgr)) * 0.00001
  if (cf.population >= 90000) {
    demand += ct.travelDestination ? 10 : 5
  }
  if (cf.traveldestination) {
    demand += ct.population > 90000 ? 20 : 10
  }
  return Math.floor(demand)
}

function goodsDemand(period, cities, city) {

  let c = cities.city(city)[0]

  let goodsdemand = ct.goodsdemand

  let demand = (2 * c.population * (1 + period * c.growthrate)) * 0.00001
  //adjust this demand with the goodsdemand factor which goes from 0(no demand) to 10(maximum demand)
  demand *= goodsdemand
  return Math.floor(demand)

}

function goodsSupply(period, cities, city) {

  let c = cities.city(city)[0]

  let goodsdemand = ct.goodssupply

  let supply = goodssupply * (1 + period * c.growthrate)

  return Math.floor(supply)

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
    if (dist < Game.CITY_RADIUS) {
      city = c
      break;
    }
  }
  return city
}

function distanceToClosestCity(cities, x, y) {
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
  } else if (!Number.isFinite(m2)) {
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
  ctx.moveTo(x + r, y);
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.stroke();

  let points = [];
  let d = Game.WPL
  let done = true;
  let count = 0
  do {

    // to stop unending loop
    if (count++ > 100) done = true
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
      //if (lineLength(p_1.x, p_1.y, p2x, p2y) > d) {
      if (Math.abs(lineLength(p_1.x, p_1.y, p2x, p2y) - d) > 1) {
        //find the point a new point on the findPointOnCircle
        let p = findPointOnCircle(x, y, r, p_1.x, p_1.y);
        p1x = p.x;
        p1y = p.y;
        done = false;
      } else {
        done = true;
      }
    } else {
      //if (lineLength(p_2.x, p_2.y, p2x, p2y) > d) {
      if (Math.abs(lineLength(p_2.x, p_2.y, p2x, p2y) - d) > 1) {
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

function play(audio, time_in_milisec) {
  audio.play();
  setTimeout(() => { audio.pause(); }, time_in_milisec);
}

function getFeature(ctx, x, y) {
  let feature = Game.FEATURE_LAND
  let imgData = ctx.getImageData(x, y, 1, 1)
  if (imgData.data[0] == 77 && imgData.data[1] == 77 && imgData.data[2] == 243) {
    feature = Game.FEATURE_WATER
  } else if (imgData.data[0] == 255 && imgData.data[1] == 255 && imgData.data[2] == 255) {
    feature = Game.FEATURE_TUNNEL
  }
  return feature
}

function getMilestone(game) {
  if (game.period == 1) {
    let milestone = 'Congratulations on launching the game.'
    let routes = ''
    for (let p = 0; p < game.paths.length; p++) {
      if (game.paths._paths[p].finalized) {
        routes += game.paths._paths[p].name
      }
    }
    milestone += `You should see trains running on following routes: ${routes}`
    return milestone
  }
  if (game.period > 0 && game.period % 5 == 0) {
    let milestone = 'In the last 5 periods you had ticket sales of : '
    let ticketsales = 0
    for (let p = game.cash.periods.length - 1; p > game.cash.periods.length - 6; p--) {
      ticketsales += game.cash.periods[p].ticketsales
    }
    milestone += `${Math.ceil(ticketsales / 1000)}K`
    return milestone
  }
}

function getBrightness(frame) {
  let fr = frame % 100
  if (fr >= 0 && fr <= 40) {
    //day
    return 1
  } else if (fr >= 50 && fr <= 90) {
    //night
    return 0.2
  } else if (fr > 40 && fr < 50) {
    //dusk
    return (1 - (fr - 40) * 8 / 90)
  } else if (fr > 90 && fr <= 100) {
    //dawn
    return (0.2 + (fr - 90) * 8 / 90)
  }
}

function pointIsOverWater(transform, x) {
  //returns true or false
  game.ctx_background.restore()
  game.ctx_background.setTransform(transform)
  let imgData = game.ctx_background.getImageData(x, 0, 1, 2)
  console.log(imgData.data[0], imgData.data[1], imgData.data[2], imgData.data[4], imgData.data[5], imgData.data[6])
  return imgData.data[4] == 77 && imgData.data[5] == 77 & imgData.data[6] == 243
}
function range(start, stop, step) {
  if (typeof stop == 'undefined') {
    // one param defined
    stop = start;
    start = 0;
  }

  if (typeof step == 'undefined') {
    step = 1;
  }

  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
    return [];
  }

  var result = [];
  for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i);
  }

  return result;
};