import express from "express";
import bodyParser from "body-parser"

const server = express();
// Api url
const apiUrl = "https://ultitv-api.netlify.app/api/v2"

server.set("view engine", "ejs")
server.set("views", "./views")
server.set("port", process.env.PORT || 8000)

server.use(express.static("public"))
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: true}))

server.listen(server.get("port"), () => {
    console.log(`Application started on http://localhost:${server.get("port")}`)
})

server.get("/", async (req, res) => {
    // TODO - Variable game id
    const gameData = await dataFetch(`${apiUrl}/games?id=111`)
    const playerData = await dataFetch(`${apiUrl}/players?orderBy=jerseyNumber&direction=ASC`)
    const gameStats = await dataFetch(`${apiUrl}/stats?id=111`)

    const allTeams = await dataFetch(`${apiUrl}/teams`)

    res.render("index", { gameData, playerData, gameStats, allTeams })
})

server.post("/playerform", async (req, res) => {

    const postPlayerURL = apiUrl + "/players"
    req.body.jerseyNumber = Number(req.body.jerseyNumber)
    console.log(req.body)

    
    postJson(postPlayerURL, req.body).then((data) => {
		
        let newPlayer = req.body

    
        if (data.succes) {
          res.redirect("/?memberPosted=true") 
        } else {
                
          const errormessage = `${data.message}: Mogelijk komt dit door de slug die al bestaat.`
          const newteam = { error: errormessage, values: newPlayer }
          console.error(errormessage)
        }
      })

    res.redirect("/")
})

server.post("/teamform", async (req, res) => {

    const postTeamURL = apiUrl + "/teams"
    req.body.seeding = Number(req.body.seeding)
    console.log(req.body)

    // For reference
    // req.body.facts = []
    // req.body.players = []
    

    postJson(postTeamURL, req.body).then((data) => {
		
        let newTeam = req.body

    
        if (data.succes) {
          res.redirect("/?memberPosted=true") 
        } else {
                
          const errormessage = `${data.message}: Mogelijk komt dit door de slug die al bestaat.`
          const newteam = { error: errormessage, values: newTeam }
          console.error(errormessage)
        }
      })
    res.redirect("/")
})

// Api call function
async function dataFetch(url) {
    const data = await fetch(url)
        .then((response) => response.json())
        .catch((error) => error)
    return data
}

/**
 * postJson() is a wrapper for the experimental node fetch api. It fetches the url
 * passed as a parameter using the POST method and the value from the body paramater
 * as a payload. It returns the response body parsed through json.
 * @param {*} url the api endpoint to address
 * @param {*} body the payload to send along
 * @returns the json response from the api endpoint
 */
export async function postJson(url, body) {
	console.log(2, JSON.stringify(body))
  return await fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => response.json())
    .catch((error) => error)
}