const mongoose = require('mongoose')

const TicketSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId },
    eventID: { type: mongoose.Schema.Types.ObjectId }
})

const TicketModel = mongoose.model('TicketModel', TicketSchema)

module.exports = TicketModel