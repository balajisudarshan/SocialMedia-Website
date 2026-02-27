const mongoose = require('mongoose')

const project = new mongoose.Schema({
    projectName:{
        type:String,
        required:true
    },
    projectCode:{
        type:String,
        unique:true,
        uppercase:true,
        index:true
    },
    description:{
        type:String,
        required:true
    },
    techStack:[String],
    tags:[String],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    status:{
        type:String,
        enum:["open","close"],
        default:"open"
    },
    visibility:{
        type:String,
        enum:["public","connections","private"],
        default:"connections"
    },
    allowedUsers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    createdAt:{
        type:Date,
        default:Date.now()
    }
    
})

module.exports = mongoose.model("Project",project)