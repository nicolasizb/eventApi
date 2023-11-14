const UserModel = require('../models/User.model.js')

async function logIn(req, res) {
    const { email, password } = req.body;
    
    try {
        const userFound = await UserModel.findOne({ email: email })

        if(userFound) {
            const isValidPassword = await UserModel.comparePassword(password, userFound.password)
            if(isValidPassword) {                
                res.status(200).json('LOG INNNN')
            } else {
                res.status(400).json('EMAIL OR PASSWORD INCORRECT')
            }
        } else {
            res.status(400).json('EMAIL OR PASSWORD INCORRECT')
        }
    } catch (error) {
        console.log(error)  
        res.status(400).json({ error: 'Error' })
    }
}

async function signUp(req, res) {
    try {
        const { name, email, password, address, dni, loginStatus } = req.body

        const userFound = await UserModel.findOne({ email: email })

        if(!userFound) {
            const user = new UserModel({
                name: name, 
                email: email, 
                password: password, 
                address: address, 
                dni: dni, 
                loginStatus: loginStatus
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

module.exports = {
    logIn,
    signUp
}
