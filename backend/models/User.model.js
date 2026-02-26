const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    bio:{
        type:String,
        default:""
    },
    skills:[{
        type:String
    }],
    avatar:{
        type:String,
        default:""
    },

    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    
    blockedUsers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    contactLinks:{
        email:String,
        discord:String,
        linkedIn:String,
        github:String
    },
},{timestamps:true})

module.exports = new mongoose.model("User",userSchema)
