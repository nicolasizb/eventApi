const express = require('express')
const cors = require('cors')
const router = require('./routes/routes.js')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// app.use(cors())

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type,Authorization',
}));
app.use(router)

module.exports = {
    app
}   