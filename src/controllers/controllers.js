const UserModel = require('../models/User.model.js')

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
        const { first_name, last_name, email, password, dni, login_status } = req.body

        const userFound = await UserModel.findOne({ email: email })

        if(!userFound) {
            const user = new UserModel({
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

module.exports = {
    logIn,
    signOn,
    changeStatusLog,
    getUser
}
