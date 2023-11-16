const { Router } = require('express')
const multer = require('multer')
const { logIn, signOn, changeStatusLog, getUser, uploadProfilePhoto, uploadPictureEvent, addEvent } = require('../controllers/controllers.js')

const upload = multer({ storage: multer.memoryStorage() })

const router = Router()

router.get('/', (req, res) => {
    res.status(200).json('Welcome to this API')
})

router.get('/user/:id', getUser)
router.post('/sign-in', logIn)
router.post('/sign-on', signOn)
router.post('/log', changeStatusLog)
router.post('/create-event', addEvent)

router.post('/upload-profile-photo', upload.single('filename') , uploadProfilePhoto)
router.post('/upload-picture-event', upload.single('filename') , uploadPictureEvent)

// router.get('/events', getEvents)
// router.post('/create-event', createEvent)

module.exports = router