const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const userModel = require('./models/user')
const confirmModel = require('./models/confirm')

const sendEmail = require('./utilities/sendEmail')

const PORT = 3000
const DB_CONNECTION = 'mongodb://localhost:27017/email'

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect(DB_CONNECTION,{useUnifiedTopology:true,useNewUrlParser:true}).then(()=> console.log("database connection established"))

app.post('/signup',async (req,res)=>{
    const {email,password} = req.body
    const userExists = await userModel.findOne({email}).populate('confirm')
    if(userExists && userExists.activated) return res.json("email is already taken")
    else if(userExists && !userExists.activated) {
        const mailOptions = {
            from: "lenofreality@kit.edu.kh", // sender address
            to: email, // list of receivers
            subject: 'ConfirmCode', // Subject line
            text: 'VerifyCode: '+userExists.confirm.code,
    
        }
        const response = await sendEmail(mailOptions)
        return res.json("email has not been activated. Resending confirm code")
    }
    const confirmcode= Math.floor(100000 + Math.random() * 900000);
    const newConfirm = await confirmModel.create({code:confirmcode})
    const newUser = await userModel.create({
        email,
        password,
        confirm:newConfirm._id
    })
    const mailOptions = {
        from: "lenofreality@kit.edu.kh", // sender address
        to: email, // list of receivers
        subject: 'ConfirmCode', // Subject line
        text: 'VerifyCode: '+confirmcode,

    }
    const response = await sendEmail(mailOptions)
    return res.json(response)
})
app.post('/confirm',async (req,res)=>{
    const {email,code} = req.body
    const user = await userModel.findOne({email}).populate('confirm')
    if(user && user.activated) return res.json("email already confirmed")
    if(!user) return res.json("email has not been registered yet")
    if(code != user.confirm.code) return res.json("incorrect confirmation code")
    await userModel.updateOne({email},{activated:true})
    return res.json("email confirmed successfully")
})
app.post("/login", async (req,res)=> {
    const {email,password} = req.body
    const userExists = await userModel.findOne({email})
    if(!userExists) return res.json("Incorrect email")
    if(userExists && !userExists.activated) return res.json("user has not been confirmed yet")
    if(userExists.password != password) return res.json("Incorrect password")
    else return res.json("Signed in successfully")
})
app.get("/users",async (req,res)=>{
    const users = await userModel.findOne({email:'panhboth14@gmail.com'}).populate('confirm')
    return res.json(users)
})
app.listen(PORT,()=> console.log(`server running on port ${PORT}...`))