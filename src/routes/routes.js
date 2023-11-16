const { Router } = require('express')
const multer = require('multer')
const { logIn, signOn, changeStatusLog, getUser, uploadProfilePhoto } = require('../controllers/controllers.js')

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.get('/', (req, res) => {
    res.status(200).json('Welcome to this API')
})

router.get('/user/:id', getUser)
router.post('/sign-in', logIn)
router.post('/sign-on', signOn)
router.post('/log', changeStatusLog)

router.post('/upload-profile-photo', upload.single('filename') , uploadProfilePhoto)

// router.get('/events', getEvents)
// router.post('/create-event', createEvent)

module.exports = router