let auth0 = null
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

const updateUI = async ()=>{
  const isAuthenticated = await auth0.isAuthenticated()
  document.getElementById('btn-login').disabled=isAuthenticated
  document.getElementById('btn-logout').disabled=!isAuthenticated

  //logic to show or hide the gated content after authentication
  if(isAuthenticated){
    document.getElementById("gated-content").classList.remove("hidden")
    document.getElementById("ipt-access-token").innerHTML = await auth0.getTokenSilently()
    document.getElementById("ipt-user-profile").innerHTML = JSON.stringify(await auth0.getUser())
  }else{
    document.getElementById("gated-content").classList.add("hidden")  
  }
}

const login = async () => {
  console.log(`window.location.origin: ${window.location.origin}`)
  await auth0.loginWithRedirect({
    redirect_uri:window.location.origin
  })
}

const logout = () => {
  auth0.logout({
    returnTo:window.location.origin
  })
}

window.onload = async() => {
  await conifigureClient()
  updateUI()

  //check if the useris authenticated or not
  const isAuthenticated = await auth0.isAuthenticated()

  if(isAuthenticated){

    //show the gated content and return
    return
  }

  //check for code and state parameters in the query string
  const query = window.location.search
  if(query.includes("code=") && query.includes("state=")){
    //process the login state
    await auth0.handleRedirectCallback()
    updateUI()
    window.history.replaceState({}, document.title, "/");
  }


}
let game = new Game()