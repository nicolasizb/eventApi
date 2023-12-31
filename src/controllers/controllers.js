const { initializeApp } = require('firebase/app')
const firebaseConfig = require('../config/firebase.config.js')
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage')

const UserModel = require('../models/User.model.js')
const EventModel = require('../models/Event.model.js')
const TicketModel = require('../models/Ticket.model.js')

const { response } = require('express')
const { default: mongoose, Model } = require('mongoose')

// Connection with firebase
const firebaseCon = initializeApp(firebaseConfig)
const storage =  getStorage(firebaseCon)

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
        let { profile_photo, first_name, last_name, email, password, dni, login_status } = req.body

        const userFound = await UserModel.findOne({ email: email })

        if(!userFound) {
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
    } catch (error) {
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

async function addEvent(req, res) {
    const { picture, title, description, date, place, city, cost, host } = req.body
    
    try {
        const userFound = await UserModel.findOne({ _id: host }) 

        if(userFound) {
            const event = new EventModel({
                picture: picture,
                title: title,
                description: description,
                date: date,
                place: place,
                city: city,
                cost: cost,
                host: host
            })

            const newEvent = event.save()

            res.json(200).json({newEvent: newEvent})
        } else {
            res.json(404).json({
                error: "User not found"
            })
        }
    } catch (error) {
        console.error(error)
    }
}

async function getEvents(req, res) {
    try {
        const events = await EventModel.find({})

        if(events) {
            res.status(200).json(events)
        } else {
            res.status(400).json(events)
        }
    } catch (error) {
        console.error(error)
    }
}

async function getEvent(req, res) {
    const { id } = req.params

    try {
        const event = await EventModel.findOne({ _id: id }) 

        if(event) {
            res.status(200).json(event)
        } else {
            res.status(404).json(event)
        }
    } catch (error) {
        console.error(error)
    }
}

async function getTickets(req, res) {
    try {
        const tickets = await TicketModel.find({})
        
        if(tickets.length > 0) {
            const ticketPromises = tickets.map( async (ticket) => {
                const ticketFound = await TicketModel.findOne({ _id: ticket._id })
                const userFound = await UserModel.findOne({ _id : ticket.userID })
                const eventFound = await EventModel.findOne({ _id: ticket.eventID })

                if(ticketFound && userFound && eventFound) {
                    return {
                        id: {
                          ticketID: ticketFound._id,  
                        },
                        user: {
                            id: userFound._id,
                            first_name: userFound.first_name,   
                            last_name: userFound.last_name,
                            dni: userFound.dni
                        },
                        event: {
                            id: eventFound._id,
                            picture: eventFound.picture,
                            title: eventFound.title,
                            date: eventFound.date,
                            place: eventFound.place,
                            city: eventFound.city,
                            cost: eventFound.cost
                        }
                    }
                } else {
                    res.status(404).json("Data ID not found")
                }
            })
            
            const ticketResults = await Promise.all(ticketPromises)

            if (ticketResults.some(result => result === null)) {
                res.status(404).json("Data ID not found");
            } else {
                res.status(200).json(ticketResults);
            }
        } else {
            res.status(404).json("Error data")        
        }
    } catch (error) {
        console.error(error)
        res.status(500).json("Error interno del servidor"); 
    }
}

async function createTicket(req, res) {
    const { userID, eventID } = req.body

    try {
        const userFound = await UserModel.findOne({ _id: userID })
        const eventFound = await EventModel.findOne({ _id: eventID })

        if(userFound && eventFound) {
            const ticket = new TicketModel({
                userID: userID, 
                eventID: eventID
            }) 

            const newTicket = ticket.save()

            res.status(200).json("Ticket created")
        } else {
            res.status(404).json("Ticket or event not found")
        }
    } catch (error) {
        console.error(error)
    }
}

async function uploadProfilePhoto(req, res) {
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

async function uploadPictureEvent(req, res) {
    try {
        const dateTime = giveCurrectDateTime()

        // Create file name before uploading (Where, reference)
        const storageRef = ref(storage, `picture_event/${req.file.originalname + ' ' + dateTime}`)

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

module.exports = {
    logIn,
    signOn,
    changeStatusLog,
    getUser,
    addEvent,
    getEvents,
    getEvent,
    getTickets,
    createTicket,
    uploadProfilePhoto,
    uploadPictureEvent
}