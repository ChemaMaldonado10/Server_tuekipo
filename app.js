// Imports of main libraries.
const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const morgan = require("morgan")

const app = express()

app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: false }))

// Enable CORS. 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Router for users endpoints.
const users = require('./routes/user')
app.use(users)

// Router for entities endpoints.
const entities = require('./routes/entity')
app.use(entities)

// Router for login endpoints
const login = require('./routes/login')
app.use(login)

// Router for searching endpoints
const searches = require('./routes/search')
app.use(searches)

// Router for uploading endpoints
const upload = require('./routes/upload')
app.use(upload)


// Messages for main http empty route and console.
app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send("Hello from ROOT")
})

app.listen(3003, () => {
    console.log("Server is listening in port 3003. Nice!")
})