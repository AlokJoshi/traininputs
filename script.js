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
      document.querySelector(".user").innerHTML = email
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
        if(games.length>1){
          let done=false
          let list = games.map(game=>game.gamename + `, Id:(${game.id})`).join(",")
          let selectedgameid = 0
          while (!done) {
            selectedgameid = prompt(`Enter the game Id of the game you want to continue playing. The games you have played so far are: ${list}`)
            selectedgameid*=1
            done = games.map(game=>game.id).includes(selectedgameid)
          }
          localStorage.setItem('gameid',selectedgameid)
          localStorage.setItem('email',email)
          game = new Game(email,selectedgameid,games.filter(game=>game.id==selectedgameid).gamename)
        }else{
          localStorage.setItem('gameid',games[0].id)
          localStorage.setItem('email',email)
          game = new Game(email,games[0].id,games[0].gamename)
        }
        game.loadFromDB() 
      } else {
        //since the user has been authenticated but does not exist in DB
        let gameid = await createUserAndDefaultGame(email, Game.START_GAME_NAME)
        console.log(`Gameid returned by createUserAndDefaultGame: ${gameid}`)
        localStorage.setItem('email', email)
        localStorage.setItem('gameid', gameid)
        game = new Game(email, gameid, Game.START_GAME_NAME)
      }
    } else {
        // document.getElementById("gated-content").classList.add("hidden")
        let email = 'anonymous-'+ Date.now()
        let gameid = await createUserAndDefaultGame(email, Game.START_GAME_NAME)
        localStorage.setItem('email', email)
        localStorage.setItem('gameid', gameid)
        game = new Game(email, gameid, Game.START_GAME_NAME)
    }
    displayLeaderboardTable(localStorage.getItem('email'),Game.LEADERBOARDPERIODS)

  } catch (err) {
    console.log(`Error in UpdateUI: ${err}`)
  } //end of try catch block
}

const login = async () => {
  console.log(`window.location.origin: ${window.location.origin}`)
  await auth0.loginWithRedirect({
    redirect_uri: window.location.origin
  })
}

const logout = () => {
  localStorage.removeItem('email')
  localStorage.removeItem('gameid')
  auth0.logout({
    returnTo: window.location.origin
  })
}

window.onload = async () => {
  await conifigureClient()
  updateUI()

  //check if the useris authenticated or not
  const isAuthenticated = await auth0.isAuthenticated()

  if (isAuthenticated) {

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
  console.log(query)
  if (query.includes("code=") && query.includes("state=")) {
    //process the login state
    await auth0.handleRedirectCallback()
    updateUI()
    //this is to remove the query strings of code and state etc.
    window.history.replaceState({}, document.title, "/");
  }


}
