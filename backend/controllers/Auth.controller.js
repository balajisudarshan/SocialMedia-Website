const User = require('../models/User.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerUser = async(req,res)=>{
    const {userName,firstName,lastName,email,password,bio,skills,contactLinks} = req.body
    try {

        if(!userName || !firstName || !lastName || !email || !password){
            return res.status(400).json({message:"All fields are required"})
        }

        const existingEmail = await User.findOne({email})
        const existingUsername = await User.findOne({userName})

        if(existingEmail || existingUsername){
            return res.status(400).json({message:"User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = await User.create({
            userName,
            firstName,
            lastName,
            email,
            password:hashedPassword,
            bio,
            skills
        })

        return res.status(201).json({
            message:"User created Successfully",
            user:{
                id:newUser._id,
                userName:newUser.userName,
                email:newUser.email
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}


const loginUser = async(req,res)=>{
    const {email,password} = req.body

    try {

        if(!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }

        const user = await User.findOne({email}).select("+password")

        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        const isPasswordValid = await bcrypt.compare(password,user.password)

        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid credentials"})
        }

        const token = jwt.sign(
            {id:user._id.toString()},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )

        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"lax"
        })

        return res.status(200).json({
            message:"Login successful",
            user:{
                id:user._id,
                userName:user.userName,
                email:user.email
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}

const me = async(req,res)=>{
    const id = req.user

    try {
        const user = await User.findById(id)
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        return res.status(200).json({message:"User found",user})
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"})
        console.log(error)
    }
}

const updateProfile = async(req,res)=>{
    const id = req.user
    try{
        const {bio,skills,contactLinks} = req.body

        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        if(bio !== undefined) {
            user.bio = bio;
        }
        if(skills !== undefined){
            user.skills = skills
        }
        if(contactLinks !== undefined){
            user.contactLinks = contactLinks
        }
        await user.save();

        return res.status(200).json({message:"User updated successfully"})
    }catch(err){
        console.log(err)
    }
}

module.exports = {registerUser,loginUser,me,updateProfile}