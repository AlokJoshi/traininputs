let noncanvases= document.getElementById('noncanvases')
let canvases= document.getElementById('canvases')

noncanvases.style.visibility='collapse'

let sb = document.getElementById('railwaytracks')
var tbl = document.getElementById("passengers");
var tblPerformance = document.getElementById("performancetable");
function displayPerformanceTable(cash){
   removeAllTableRows(tblPerformance)
   //cash is an array of objects
   let lastPd = cash.periods.length
   let firstPd = lastPd>=100?lastPd-100:0
   let caption = tblPerformance.createCaption();
   caption.innerHTML="Financial Performance (1000 G$)"
   let row=tblPerformance.insertRow()
   let cell = row.insertCell()
   cell.innerHTML = "Period"
   cell = row.insertCell()
   cell.innerHTML = "Opening Cash"
   cell = row.insertCell()
   cell.innerHTML = "Ticket Sales"
   cell = row.insertCell()
   cell.innerHTML = "Track/Coach/Station"
   cell = row.insertCell()
   cell.innerHTML = "Interest"
   cell = row.insertCell()
   cell.innerHTML = "Depreciation"
   cell = row.insertCell()
   cell.innerHTML = "Other Expenses"
   cell = row.insertCell()
   cell.innerHTML = "Profit After Tx & Dep"
   for(let i = firstPd; i < lastPd; i++){
      row = tblPerformance.insertRow();
      cell = row.insertCell()
      cell.innerHTML = i
      cell = row.insertCell()
      cell.innerHTML=Math.floor(cash.periods[i].openingcash/1000)
      cell = row.insertCell()
      cell.innerHTML=Math.floor(cash.periods[i].ticketsales/1000)
      cell = row.insertCell()
      cell.innerHTML=Math.floor((cash.periods[i].trackcost
                                 +cash.periods[i].enginecost
                                 +cash.periods[i].coachcost
                                 +cash.periods[i].stationcost)/1000)
      cell = row.insertCell()
      cell.innerHTML=Math.floor(cash.periods[i].interest/1000)
      cell = row.insertCell()
      cell.innerHTML=Math.floor(cash.periods[i].depreciation/1000)
      cell = row.insertCell()
      cell.innerHTML=Math.floor((cash.periods[i].maintenancecost
                                +cash.periods[i].runningcost)/1000)
      cell = row.insertCell()
      cell.innerHTML=Math.floor(cash.periods[i].patd/1000)
   }
}
function displayPassengersTable(rows){
   removeAllTableRows(tbl)
   //get set of from cities
   let from_cities = new Set(rows.map(item=>item.from))
   let from_array = [...from_cities].sort()
   let to_cities = new Set(rows.map(item=>item.to))
   let to_array = [...to_cities].sort()

   //caption
   let caption = tbl.createCaption();
   caption.innerHTML="Passengers"

   let row = tbl.insertRow();
   let cell = row.insertCell()
   cell.innerHTML='From-To'
   to_array.forEach(t=>{
      cell = row.insertCell()
      cell.innerHTML=t
   })
   from_array.forEach(f=>{
      row = tbl.insertRow();
      cell = row.insertCell()
      cell.innerHTML = f
      to_array.forEach(t=>{
         if(f==t){
            cell = row.insertCell()
            cell.innerHTML='x'   
         }else{
            cell = row.insertCell()
            let index = rows.findIndex(item=>item.from===f && item.to===t)
            if(index!=-1) cell.innerHTML=Math.floor(rows[index].passengers)
         }
      })   
   })
}
function removeAllTableRows(tbl){
   while(tbl.rows.length>0){
      tbl.deleteRow(0)
   }   
}
function updatePassengers(period,cities,passengers){
   for(let iFrom=0;iFrom<cities.cities.length;iFrom++){
     let cityFrom = cities.cities[iFrom].name
     for(let iTo=0;iTo<cities.cities.length;iTo++){ 
       let cityTo = cities.cities[iTo].name
       if(cityFrom!=cityTo){
         let demand = FromToTravelDemand(period,cities,cityFrom,cityTo)
         passengers.addPassengers(cityFrom,cityTo,demand)
       }
     }
   }
 }
function updateGoods(period,cities,goods){
   for(let iFrom=0;iFrom<cities.cities.length;iFrom++){
     let cityFrom = cities.cities[iFrom].name
     for(let iTo=0;iTo<cities.cities.length;iTo++){ 
       let cityTo = cities.cities[iTo].name
       if(cityFrom!=cityTo){
         let demand = FromToGoodsDemand(period,cities,cityFrom,cityTo)
         goods.addGoods(cityFrom,cityTo,demand)
       }
     }
   }
 }

function displayTicketPricesTable(rows){
   let tbl = document.getElementById('ticketprices')
   removeAllTableRows(tbl)
   //get set of from cities
   let from_cities = new Set(rows.map(item=>item.from))
   let from_array = [...from_cities].sort()
   let to_cities = new Set(rows.map(item=>item.to))
   let to_array = [...to_cities].sort()

   //caption
   let caption = tbl.createCaption();
   caption.innerHTML="Ticket Prices"

   let row = tbl.insertRow();
   let cell = row.insertCell()
   cell.innerHTML='From-To'
   to_array.forEach(t=>{
      cell = row.insertCell()
      cell.innerHTML=t
   })
   from_array.forEach(f=>{
      row = tbl.insertRow();
      cell = row.insertCell()
      cell.innerHTML = f
      to_array.forEach(t=>{
         if(f==t){
            cell = row.insertCell()
            cell.innerHTML='x'   
         }else{
            cell = row.insertCell()
            let index = rows.findIndex(item=>item.from===f && item.to===t)
            if(index!=-1) cell.innerHTML=rows[index].ticket
         }
      })   
   })
}