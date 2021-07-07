let auth0 = null
let loggedInUser = null
let game = null
const fetchAuthConfig = () => fetch("/auth_config.json")
const conifigureClient = async () => {
  const response = await fetchAuthConfig()
  const config = await response.json()
  console.log(JSON.stringify(config))
  auth0 = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId
  })
}
const updateUI = async () => {

  try {

    const isAuthenticated = await auth0.isAuthenticated()
    document.getElementById('btn-login').disabled = isAuthenticated
    document.getElementById('btn-logout').disabled = !isAuthenticated

    //logic to show or hide the gated content after authentication
    if (isAuthenticated) {

      //document.getElementById("gated-content").classList.remove("hidden")
      //document.getElementById("ipt-access-token").innerHTML = await auth0.getTokenSilently()
      loggedInUser = await auth0.getUser()
      const email = loggedInUser.email
      localStorage.setItem('email', email)
      localStorage.setItem('picture', loggedInUser.picture)
      localStorage.setItem('nickname', loggedInUser.nickname)

      document.querySelector("#usernickname").innerHTML = loggedInUser.nickname
      document.querySelector("#userpicture").src = loggedInUser.picture
      document.querySelector("#userpicture").title = email

      //document.getElementById("ipt-user-profile").innerHTML = JSON.stringify(loggedInUser)
      const userInDB = await getUser(email)
      console.log(`User in DB with an email of ${email}: ${JSON.stringify(userInDB)}`)
      let userExistsInDB = userInDB !== undefined
      console.log(`User exists?userInDB:${userInDB}, userExistsInDB:${userExistsInDB}`)
      if (userExistsInDB) {
        //get the last game that the user was playing
        let games = await getAllGamesForEmail(email)
        console.log(`data for getAllGamesForEmail(${email} is : ${JSON.stringify(games)})`)
        //games is an array of all games that this email was playing
        let selectedGame=null
        let gameid=localStorage.getItem('gameid')
        let gamename=localStorage.getItem('gamename')
        if(games.length>1){
          //show it as a list
          // let list = games.map(game=>`<li> Id:(${game.id}) Name:${game.gamename}</li>`).join(" ")
          // let html = `<ul>${list}</ul>`
          //show it as a table
          let list = games.map(game=>`<tr> <td>${game.id}</td> <td>${game.lastperiod}</td> <td>${game.gamename}</td></tr>`).join(" ")
          let html = `<table><tr><th>id</th><th>last period</th><th>game name</th></tr>${list}</table>`

          let inputbox = new Myinputbox('Load a game from Database',
            `<p>List below shows all the games you have played till now. Select the id of the game you want to play</p>
            ${html}`,
            'Enter ID' ,(ok,value)=>{
              if(ok){
                value = Number.parseInt(value)
                selectedGame = games.find(game=>game.id==value)
                if(selectedGame){
                  gameid = selectedGame.id
                  gamename = selectedGame.gamename
                }else{
                  //user did not elect to enter a valid game id
                  //by default load the game that was being played last
                }
              } 
            })
        }else{
          selectedGame=games[0]
          gameid = selectedGame.id
          gamename = selectedGame.gamename
        }
        localStorage.setItem('gameid',gameid)
        game = new Game(email,gameid,gamename||'')
        game.loadFromDB() 
      } else {
        //since the user has been authenticated but does not exist in DB
        let gameid = await createUserAndDefaultGame(email, Game.START_GAME_NAME)
        console.log(`Gameid returned by createUserAndDefaultGame: ${gameid}`)
        //localStorage.setItem('email', email)
        localStorage.setItem('gameid', gameid)
        game = new Game(email, gameid, Game.START_GAME_NAME)
      }
    } else {
        // user has not logged in and so has not been authenticated against auth0 
        let email = 'anonymous-'+ Date.now()
        let gameid = await createUserAndDefaultGame(email, Game.START_GAME_NAME)
        localStorage.setItem('email', email)
        localStorage.setItem('gameid', gameid)
        document.querySelector("#userpicture").title = `Email: ${email}`
        let src = `https://www.gravatar.com/avatar/${MD5(email)}?s=32&d=identicon`
        console.log(`Gravatar image: ${src}`)
        document.querySelector("#userpicture").src = src
        
        game = new Game(email, gameid, Game.START_GAME_NAME)
    }
    displayLeaderboardTable(localStorage.getItem('email'),Game.LEADERBOARDPERIODS)
  } catch (err) {
    console.log(`Error in UpdateUI: ${err}`)
  } 
  // finally {
  //   document.title=`Train Tycoon${game.gamename ? "-" + game.gamename : ""}`
  // }
}

const login = async () => {
  await auth0.loginWithRedirect({
    redirect_uri: window.location.origin
  })
}

const logout = () => {
  localStorage.removeItem('email')
  localStorage.removeItem('gameid')
  localStorage.removeItem('picture')
  auth0.logout({
    returnTo: window.location.origin
  })
}

const presskey = (key) => {
  let event = new KeyboardEvent("keyup", { "key": key });
  document.dispatchEvent(event) 
}

window.onload = async () => {
  await conifigureClient()
  updateUI()

  //check if the useris authenticated or not
  const isAuthenticated = await auth0.isAuthenticated()

  if (isAuthenticated) {
    let pr = await auth0.getUser()
    localStorage.setItem('picture',pr.picture)
    localStorage.setItem('nickname',pr.nickname)
    //show the gated content and return
    return
  }

  //check for code and state parameters in the query string
  //this happens only when the user has initiated a login
  //when user initiates a login, the Auth0 checks the user details
  //against the user data it has and calls back our web site with
  //code and state query string parameters. The handleRedirectCallback
  //is then able to read the code and state query string parameters
  //and establish a connection with Auth0 web site.

  const query = window.location.search
  if (query.includes("code=") && query.includes("state=")) {
    //process the login state
    await auth0.handleRedirectCallback()
    updateUI()
    //this is to remove the query strings of code and state etc.
    window.history.replaceState({}, document.title, "/");
  }


  //socket.emit('chat','I am in')
}
