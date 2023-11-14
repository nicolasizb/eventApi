const { Router } = require('express')
const router = Router()
const UserModel = require('../models/User.model.js')
const { logIn, signUp } = require('../controllers/controllers.js')

router.get('/', (req, res) => {
    res.status(200).json('Welcome to this API')
})

router.get('/sign-in', logIn)

router.post('/sign-up', signUp)

module.exports = router