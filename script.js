

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
  const isAuthenticated = await auth0.isAuthenticated()
  document.getElementById('btn-login').disabled = isAuthenticated
  document.getElementById('btn-logout').disabled = !isAuthenticated

  //logic to show or hide the gated content after authentication
  if (isAuthenticated) {

    document.getElementById("gated-content").classList.remove("hidden")
    document.getElementById("ipt-access-token").innerHTML = await auth0.getTokenSilently()
    loggedInUser = await auth0.getUser()
    const email = loggedInUser.email
    document.querySelector(".user").innerHTML = email
    document.getElementById("ipt-user-profile").innerHTML = JSON.stringify(loggedInUser)
    const userInDB = await getUser(email)
    console.log(`User in DB with an email of ${email}: ${JSON.stringify(userInDB)}`)
    let userExistsInDB = userInDB !== undefined
    console.log(`User exists: ${userExistsInDB}`)
    if (userExistsInDB) {
      /* Todo :Commented out till the saving into db is completed and tested

      //is the user already playing a game? We can make that out if the email and 
      //gameid value is 
      //set in local storage
      const emailInLocalStorage = localStorage.getItem('email')
      if(email==emailInLocalStorage){
        const gameid = localStorage.getItem('gameid')
        if(gameid==null){
          //no game created yet
          let gameid = await createUserAndDefaultGame(email,Game.START_GAME_NAME)
          if(gameid){
            //store the results in local storage
            localStorage.setItemItem('email',email)
            localStorage.setItemItem('gameid',gameid)
            alert(`Not implemented. Hence game could not be created for ${email}`)
            game = new Game(email,gameid,Game.START_GAME_NAME)
          }else{
            alert(`game could not be created for ${email}`)
          }
        }else{
          //------------------Todo---------------------
          //here we should load the game that the user was
          //playing last. However, since load is not complete
          //we start the user with a new Game
          game = new Game(email,gameid,Game.START_GAME_NAME)
        }
      }else if(emailInLocalStorage==null){
        //the user is an authenticated user and exists in our DB and has a game going
        //but playing on another device
        //so load the current or latest game from DB
        // ****************todo*****************************
        // Game.loadFromDB
        game = new Game('anonymous',0,Game.START_GAME_NAME)
        alert('Authenticated user and exists in our DB but was not playing on this device')
        // ****************todo*****************************
      }

       */
      let ok = await deleteUser(email)
      console.log(`ok in if(userExists) in script.js: ${ok}`)
      if(ok){
        let json2 = createUserAndDefaultGame(email, Game.START_GAME_NAME)
        json2.then(data => {
          console.log(`user and default game created successfully: ${data}`)
          gameid = data
          game = new Game(email, gameid, Game.START_GAME_NAME)
        }).catch(err => {
          console.error(`Error in creating user and default game : ${err}`)
        })
      }
    } else {
      //since the user has been authenticated but does not exist in DB
      let gameid = await createUserAndDefaultGame(email, Game.START_GAME_NAME)
      console.log(`Gameid returned by createUserAndDefaultGame: ${gameid}`)
      game = new Game(email, gameid, Game.START_GAME_NAME)
      localStorage.setItem('email', email)
      localStorage.setItem('gameid', gameid)
    }
  } else {
    //the user is not authenticated
    document.getElementById("gated-content").classList.add("hidden")
    game = new Game('anonymous', 0, Game.START_GAME_NAME)
    localStorage.setItem('email', 'anonymous')
    localStorage.setItem('gameid', null)
  }
}

const login = async () => {
  console.log(`window.location.origin: ${window.location.origin}`)
  await auth0.loginWithRedirect({
    redirect_uri: window.location.origin
  })
}

const logout = () => {
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
  const query = window.location.search
  console.log(query)
  if (query.includes("code=") && query.includes("state=")) {
    //process the login state
    await auth0.handleRedirectCallback()
    updateUI()
    window.history.replaceState({}, document.title, "/");
  }


}
