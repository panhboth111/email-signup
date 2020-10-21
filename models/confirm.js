const mongoose = require("mongoose")

const ConfirmSchema = new mongoose.Schema({
    code:String
})  
const ConfirmModel = mongoose.model('Confirm',ConfirmSchema)
module.exports = ConfirmModel