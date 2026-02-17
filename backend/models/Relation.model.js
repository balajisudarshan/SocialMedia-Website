const mongoose = require('mongoose')

const relationSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    reciever:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    Status:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Relation",relationSchema);