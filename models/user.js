const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    email:String,
    password:String,
    activated:{
        type:Boolean,
        default:false
    },
    confirm:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Confirm'
    }
})  
const UserModel = mongoose.model('User',UserSchema)
module.exports = UserModel