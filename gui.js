let noncanvases= document.getElementById('noncanvases')
let canvases= document.getElementById('canvases')

//starting state
noncanvases.style.visibility='visible'
canvases.style.visibility='collapse'

let sb = document.getElementById('railwaytracks')
var tbl = document.getElementById("passengers");
var performancetable = document.getElementById("performancetable");
var leaderboardtable = document.getElementById("leaderboardtable");
function displayPerformanceTable(cash){
   removeAllTableRows(performancetable,1)
   //cash is an array of objects
   let lastPd = cash.periods.length
   // let caption = performancetable.createCaption();
   // caption.innerHTML="Financial Performance (1000 G$)"
   
   let steps = Math.floor((lastPd+1)/Game.PERIODS_TO_SUMMARIZE)
   let tbody = document.querySelector("#performancetable tbody")
   for(let i=1; i <= steps; i++){
      let openingcash=0
      let ticketsales=0
      let tecs = 0
      let interest = 0
      let depreciation = 0
      let mr = 0
      let patd = 0
      let tc = 0
      let ec = 0
      let cc = 0
      let wc = 0
      let sc = 0
      let si = (i-1)*Game.PERIODS_TO_SUMMARIZE
      openingcash=cash.periods[si].openingcash
      for(j=0;j<=Game.PERIODS_TO_SUMMARIZE-1;j++){

         ticketsales+=cash.periods[si+j]?.ticketsales
         tc+=cash.periods[si+j]?.trackcost
         ec+=cash.periods[si+j]?.enginecost
         cc+=cash.periods[si+j]?.coachcost
         wc+=cash.periods[si+j]?.wagoncost
         sc+=cash.periods[si+j]?.stationcost

         interest+=cash.periods[si+j]?.interest
         depreciation+=cash.periods[si+j]?.depreciation
         mr+=(cash.periods[si+j]?.maintenancecost
         +cash.periods[si+j]?.runningcost)
         patd+=cash.periods[si+j]?.patd
      }
      
      row = tbody.insertRow();
      cell = row.insertCell()
      cell.innerHTML = si
      cell = row.insertCell()
      cell.innerHTML=Math.floor(openingcash/1000)
      cell = row.insertCell()
      cell.innerHTML=Math.floor(ticketsales/1000)
      cell = row.insertCell()
      cell.innerHTML=`${Math.floor(tc/1000)}+${Math.floor(ec/1000)}+${Math.floor(cc/1000)}+${Math.floor(wc/1000)}+${Math.floor(sc/1000)}`
      cell = row.insertCell()
      cell.innerHTML=Math.floor(interest/1000)
      cell = row.insertCell()
      cell.innerHTML=Math.floor(depreciation/1000)
      cell = row.insertCell()
      cell.innerHTML=Math.floor(mr/1000)
      cell = row.insertCell()
      cell.innerHTML=Math.floor(patd/1000)
   }
}

async function displayLeaderboardTable(email,leaderboardPeriods){
   let periodlist = leaderboardPeriods.join(',')
   let rows = await getLeaderboard(email,periodlist)
   let playeremail = localStorage.getItem(`email`)

   if(playeremail.startsWith(`anonymous-`)){
      playeremail = `Anon(${playeremail.slice(-6)})`
   }
   //console.log(JSON.stringify(rows))
   removeAllTableRows(leaderboardtable,3)  

   //for anonymous players - shorten their email
   rows.forEach(item=>{
      if(item.email.startsWith(`anonymous-`)){
         item.email = `Anon(${item.email.slice(-6)})`
      }
   })
   //for anonymous players - shorten their email

   //create new objects
   let newobj = {}
   for(let i = 0;i<leaderboardPeriods.length;i++){
      let pd = leaderboardPeriods[i]
      newobj[`P${pd}`]=[]
   }
   for(let i=0;i<rows.length-1;i++){
      let pd = rows[i].period
      newobj[`P${pd}`].push(rows[i])
   }
   //create new objects
   
   //sort each object by rank_number
   for(let i=0;i<rows.length-1;i++){
      let pd = rows[i].period
      let pdobj = newobj[`P${pd}`]
      pdobj.sort((a,b)=>a.rank_number-b.rank_number)
   }
   //sort each object by rank_number

   //for each pdobj if player email appears in any of the first 3 positions, show it in the 4th position
   for(let i=0;i<rows.length-1;i++){
      let pd = rows[i].period
      let pdobj = newobj[`P${pd}`]
      let playerobj = pdobj.find(item=>item.email==playeremail)
      if(!pdobj[0])pdobj[0]={email:'',openingcash:null,rank_number:1}
      if(!pdobj[1])pdobj[1]={email:'',openingcash:null,rank_number:2}
      if(!pdobj[2])pdobj[2]={email:'',openingcash:null,rank_number:3}
      if(!pdobj[3])pdobj[3]={email:'',openingcash:null,rank_number:3}
      if(playerobj){
         pdobj[3].email=playerobj.rank_number
         pdobj[3].cash =playerobj.openingcash
      }
   }
   //for each pdobj if player email appears in any of the first 3 positions, show it in the 4th position


   const tbody = document.querySelector("#leaderboardtable tbody")
   for(let r=0; r<leaderboardPeriods.length; r++){
      row = tbody.insertRow();
      cell = row.insertCell()
      cell.innerHTML = leaderboardPeriods[r]
      let arr = newobj[`P${leaderboardPeriods[r]}`]
      for(let pos=0;pos<4;pos++){
         if(pos<arr.length){
            cell = row.insertCell()
            cell.innerHTML=Math.floor(arr[pos].openingcash/1000)
            cell = row.insertCell()
            cell.innerHTML=(pos==3)?arr[pos].rank_number:arr[pos].email
         }else{
            cell = row.insertCell()
            //cell.innerHTML=Math.floor(newobj[`P${rows[i].period}`][pos].openingcash/1000000)
            cell = row.insertCell()
            //cell.innerHTML=newobj[`P${rows[i].period}`][pos].email
         }
      }
   }
   
}

function displayPassengersTable(rows){
   removeAllTableRows(tbl,1)
   //get set of from cities
   let from_cities = new Set(rows.map(item=>item.from))
   let from_array = [...from_cities].sort()
   let to_cities = new Set(rows.map(item=>item.to))
   let to_array = [...to_cities].sort()

   let thead = document.querySelector('#passengers thead');
   // let row = thead.insertRow();
   // let cell = row.insertCell()
   // cell.innerHTML='From-To'
   // to_array.forEach(t=>{
   //    cell = row.insertCell()
   //    cell.innerHTML=t
   // })
   //tbl.appendChild(thead)
   let tbody = document.querySelector('#passengers tbody');
   from_array.forEach(f=>{
      row = tbody.insertRow();
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
   //tbl.appendChild(tbody)
}
function removeAllTableRows(tbl,numheaderrows){
   while(tbl.rows.length>numheaderrows){
      //deletes the last row
      tbl.deleteRow(-1)
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

   /* let tbl = document.getElementById('ticketprices')
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
    */
}