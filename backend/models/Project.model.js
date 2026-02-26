const mongoose = require('mongoose')

const project = new mongoose.Schema({
    projectName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    techStack:[String],
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
    createdAt:{
        type:Date,
        default:Date.now()
    }
    
})