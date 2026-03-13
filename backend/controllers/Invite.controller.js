const Invitation = require("../models/Invitation.model")
const Project = require("../models/Project.model")
const User = require("../models/User.model")
const Notification = require("../models/Notification.model")
const sendInvite = async(req,res)=>{
    const {projectId,userId} = req.body
    const sender = req.user
    try{
        const project = await Project.findById(projectId)
        if(!project){
            return res.status(404).json({message:"Project not found"})
        }
        if(project.owner.toString() !== sender){
            return res.status(403).json({message:"Only project owner can send invites"})
        }

        const receiver = await User.findById(userId)
        if(!receiver){
            return res.status(404).json({message:"User not found"})
        }

        const existingInvite = await Invitation.findOne({
            sender,
            receiver:userId,
            project:projectId,
            status:"pending"
        })

        if(existingInvite){
            return res.status(400).json({message:"Invite already sent"})
        }

        const invite = new Invitation({
            sender,
            receiver:userId,
            project:projectId,
            status:"pending"
        })
        Notification.create({
            receiver:userId,
            sender,
            type:"project_invitation",
            project:projectId,
            referenceId:invite._id,
            message:`You have been invited to join the project ${project.name}`
        })

        await invite.save()
        return res.status(201).json({message:"Invite sent successfully"})
    }catch(err){
        return res.status(500).json({message:"Error sending invite"})
    }
}
module.exports = {sendInvite}