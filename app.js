const express = require('express')
const app = express()
const port = process.env.port || 8081


const search_hash = require("./routes/search_hash")
//const create_hash = require("./routes/create_hash") //TODO: implement

app.use("/search", search_hash)
//app.use("/create", create_hash) //TODO: implement

app.get('/', (req, res) => {
    res.status(200).send("")
})


app.listen(port, err => {
    if (err) return console.log("ERROR", err)
    console.log(`Listening on port ${port}`)
})