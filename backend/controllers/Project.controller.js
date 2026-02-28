const Project = require('../models/Project.model')
const ProjectRequestModel = require('../models/ProjectRequest.model')
const User = require('../models/User.model')
const generateProjectCode = require('../utils/generateProjectCode')
// const ProjectRequest = require('../models/ProjectRequest.model')

const addProject = async (req, res) => {
    const ownerId = req.user

    try {
        const { projectName, description, techStack, tags } = req.body
        if (!projectName) {
            return res.status(404).json({ message: "Project name is required" })
        }
        const projectCode = await generateProjectCode()
        const project = await Project.create({ projectName, projectCode, description, techStack, owner: ownerId })
        return res.status(201).json({ message: "Project created successfully" })
    } catch (err) {
        console.log(err)
    }
}


const getAllProjects = async (req, res) => {
    const me = await User.findById(req.user).select("followers following")


    try {
        const connections = me.following.filter(id => me.followers.includes(id.toString()))
        console.log(connections)
        const projects = await Project.find({
            $or: [
                { visibility: "public" },
                {
                    visibility: "connections",
                    owner: { $in: connections }
                },
                {
                    owner:req.user
                }
            ]
        }
        
        ).populate("owner","userName avatar").sort({createdAt:-1})
        return res.status(200).json({projects})
    } catch (err) {
        console.log(err)
    }
}

const getMyProjects = async(req,res)=>{
    const userId = req.user
    try{
        const projects = await Project.find({owner:userId});
        return res.json({projects})
    }catch(err){
        return res.status(500).json({err})
    }
}

const sendProjectRequest = async(req,res)=>{
    const userId = req.user
    const projectId = req.params.id
    const message = req.body
    try{
        const project = await Project.findById(projectId)
        if(!project){
            return res.status(404).json({message:"Project not found"})
        }

        if(project.owner.toString() === userId){
            return res.status(400).json({message:"You own this project"})
        }

        const existing = await ProjectRequestModel.findOne({
            project:projectId,
            requester:userId,
            status:"pending"
        })
        if(existing){
            return res.status(400).json({message:"Request already sent"})
        }
        await ProjectRequest.create({
            project:projectId,
            requester:userId,
            message
        })
        
        return res.status(201).json({message:"Join request sent"})

    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
}

const getProjectRequests = async(req,res)=>{
    const userId = req.user
    const projectId = req.params.id
    try{
        const project = await Project.findById(projectId)
        if(!project){
            return res.status(404).json({message:"Project not found"})
        }
        if(project.owner.toString() !== userId){
            return res.status(401).json({message:"Un-Authorized"})
        }
        const projectRequests = await ProjectRequestModel.find({
            project:projectId,
            status:"pending"
        }).populate("requester","userName avatar")
        return res.status(200).json({projectRequests})
    }catch(err){
        console.log(err)
        return res.status(500).json({err})
    }
}

module.exports = {addProject,getAllProjects,getMyProjects,sendProjectRequest,getProjectRequests}