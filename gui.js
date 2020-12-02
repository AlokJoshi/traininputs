let noncanvases= document.getElementById('noncanvases')
let canvases= document.getElementById('canvases')

noncanvases.style.visibility='collapse'

let sb = document.getElementById('railwaytracks')
var tbl = document.getElementById("passengers");

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
   // rows.forEach(r=>{
   //    console.log(r)
   //    let row = tbl.insertRow();
   //    var cell1 = row.insertCell(0);
   //    var cell2 = row.insertCell(1);
   //    var cell3 = row.insertCell(2);
   //    cell1.innerHTML = r.from;
   //    cell2.innerHTML = r.to;
   //    cell3.innerHTML = r.passengers;
   // })
}