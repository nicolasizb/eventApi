const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
    picture: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    place: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    cost: {
        type: String,
        required: true,
    },
    host: {type: mongoose.Schema.Types.ObjectId}
})

const EventModel = mongoose.model('EventModel', EventSchema)

module.exports = EventModel