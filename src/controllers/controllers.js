const { initializeApp } = require('firebase/app')
const firebaseConfig = require('../config/firebase.config.js')
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage')

const UserModel = require('../models/User.model.js')

// Connection with firebase
const firebaseCon = initializeApp(firebaseConfig)
const storage =  getStorage(firebaseCon)

async function logIn(req, res) {
    const { email, password } = req.body;
    
    try {
        const userFound = await UserModel.findOne({ email: email })

        if(userFound) {
            const isValidPassword = await UserModel.comparePassword(password, userFound.password)
            if(isValidPassword) {                
                res.status(200).json({
                    status: true,
                    id: userFound._id
                })
            } else {
                res.status(400).json('EMAIL OR PASSWORD INCORRECT')
            }
        } else {
            res.status(400).json('User not exists')
        }
    } catch (error) {
        console.log(error)  
        res.status(400).json({ error: 'Error' })
    }
}

async function signOn(req, res) {
    try {
        const { profile_photo, first_name, last_name, email, password, dni, login_status } = req.body

        const userFound = await UserModel.findOne({ email: email })

        if(!userFound) {
            const dateTime = giveCurrectDateTime()

            // Create file name before uploading (Where, reference)
            const storageRef = ref(storage, `profile_photo/${req.file.originalname + ' ' + dateTime}`)
            const metadata = {
                contentType: req.file.mimetype 
            }
            const uploadFile = await uploadBytesResumable(storageRef, req.file.buffer, metadata)
            profile_photo = await getDownloadURL(uploadFile.ref)
          
            res.status(200).json({
                downloadURL
            })

            const user = new UserModel({
                profile_photo: profile_photo,
                first_name: first_name,
                last_name: last_name, 
                email: email, 
                password: password, 
                dni: dni, 
                login_status: login_status
            })
                  
            user.password = await UserModel.encryptPassword(password)
            const newUser = user.save()
        
            res.status(200).json({
                _id: newUser._id,   
                email: newUser.email,
                status: "Customer created"
            })    
        } else {
            res.status(400).json("User exists!")   
        }
    } catch {
        console.log(error)  
        res.status(400).json({ error: 'Error' })
    }
} 

async function changeStatusLog(req, res) {
    const { id, status } = req.body

    const userUpdate = await UserModel.updateOne({ _id: id}, { login_status: status })

    if(!userUpdate) {
        console.log('ERR')
    } else {
        res.status(200).json( {
            "NEW USER": userUpdate
        })
    }
}

async function getUser(req, res) {
    const { id } = req.params

    try {
        const userFound = await UserModel.findOne({ _id: id })

        if(userFound) {
            res.status(200).json(userFound)
        } else {
            res.status(404).json("Not found user")
        }
    } catch (error) {
        console.error(error)
    }
}

async function uploadFile(req, res) {
    try {
        const dateTime = giveCurrectDateTime()

        // Create file name before uploading (Where, reference)
        const storageRef = ref(storage, `profile_photo/${req.file.originalname + ' ' + dateTime}`)

        const metadata = {
            contentType: req.file.mimetype 
        }
        const uploadFile = await uploadBytesResumable(storageRef, req.file.buffer, metadata)
        const downloadURL = await getDownloadURL(uploadFile.ref)

        res.status(200).json({
            downloadURL
        })
    } catch(error) {
        res.status(400).send(error.message)
    }
}

function giveCurrectDateTime() {
    const today =  new Date()
    const date = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDay()
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
    const dateTime = date + ' ' + time
    return dateTime
}

// async function getEvents(req, res) {
//     const {  }
// }

// createEvent

module.exports = {
    logIn,
    signOn,
    changeStatusLog,
    getUser,
    uploadFile
}
