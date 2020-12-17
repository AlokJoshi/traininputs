const express = require('express')
const {join} = require('path')
const app = express()
const port = process.env.PORT || 3000

app.use(express.static('.'))
app.get("/auth_config.json",(req,res)=>{
    res.sendFile(join(__dirname,"auth_config.json"))
})

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))