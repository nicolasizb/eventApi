const { Router } = require('express')
const router = Router()
const UserModel = require('../models/User.model.js')
const { logIn, signOn, changeStatusLog } = require('../controllers/controllers.js')

router.get('/', (req, res) => {
    res.status(200).json('Welcome to this API')
})

router.post('/sign-in', logIn)
router.post('/sign-on', signOn)
router.post('/log', changeStatusLog)

module.exports = router