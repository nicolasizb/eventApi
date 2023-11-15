const express = require('express')
const cors = require('cors')
const router = require('./routes/routes.js')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// app.use(cors())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(router)

module.exports = {
    app
}   