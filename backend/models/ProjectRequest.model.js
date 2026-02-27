const mongoose =require('mongoose')

const projectRequestSchema = new mongoose.Schema({
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    requester:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:String,
    status:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending"
    }
},{timeStamps:true})

module.exports = mongoose.model("ProjectRequest",projectRequestSchema);