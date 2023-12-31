const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    profile_photo: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true,
    },
    dni: {
        type: Number,
        required: true,
        unique: true
    },
    login_status: {
        type: Boolean,
        required: true,
    },
    counterEventsSubscribed: [{
        type: mongoose.Schema.Types.ObjectId
    }]
})

UserSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

UserSchema.statics.comparePassword = async (password, passwordDb) => {
    return await bcrypt.compare(password, passwordDb)
}

const UserModel = mongoose.model('UserModel', UserSchema)

module.exports = UserModel