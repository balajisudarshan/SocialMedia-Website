const Relation = require('../models/Relation.model')
const User = require('../models/User.model')

const sendRequest = async (req, res) => {

    try {
        const sender = req.user
        const receiver = req.params.id
        console.log(receiver)
        if (sender === receiver) {
            return res.status(400).json({ message: "You cannot connect to yourself" })
        }

        const receiverUser = await User.findById(receiver)
        if (!receiverUser) {
            return res.status(404).json({ message: "User not found" })
        }
        const alreadyRequestedUser = await Relation.findOne({
            sender,
            receiver,
            status: "pending"
        })
        if (alreadyRequestedUser) {
            return res.status(400).json({ message: "Request already sent" })
        }

        const alreadyConnectedUser = await User.findOne({
            _id: sender,
            following: receiver
        })

        if (alreadyConnectedUser) {
            return res.status(400).json({ message: "You are already connected" })
        }

        await Relation.create({ sender, receiver })
        res.status(200).json({ message: "Connection sent successfully" })
    } catch (err) {
        console.log(err)
    }
}
const viewRequest = async (req, res) => {
    try {
        const userId = req.user
        const requests = await Relation.find({
            receiver: userId,
            status: "pending"
        }).populate("sender", "userName bio skills")
        res.status(200).json({ requests })
    } catch (error) {
        console.error(error)
    }
}

const manageConnection = async (req, res) => {
    try {
        const userId = req.user
        const requestId = req.params.id
        const allowedConnectionType = [
            'accept',
            'reject'
        ]
        const connectionType = req.params.type
        
        if (!allowedConnectionType.includes(connectionType)) {
            return res.status(400).json({ message: "Invalid Type" })
        }
        const request = await Relation.findOne({
            _id:requestId,
            receiver:userId,
            status:"pending"
        })

        if (!request) {
            return res.status(404).json({ message: "Connection not found" })
        }

        if (connectionType === 'reject') {
            request.status = 'rejected'
            await request.save()
            return res.status(200).json({ message: "Request rejected" })
        }

        request.status = 'accepted';
        await request.save()

        const senderId = request.sender;
        const receiverId = request.receiver

        await User.findByIdAndUpdate(receiverId, {
            $addToSet: { following: senderId, followers: senderId }
        })

        await User.findByIdAndUpdate(senderId, {
            $addToSet: { following: receiverId, followers: receiverId }
        })

        res.status(200).json({ message: "Connection accepted" })

    } catch (error) {
        console.log(error)
    }
}
const removeConnection = async (req, res) => {
    try {
        const user = req.user
        const connectedId = req.params.id
        const currentUser = await User.findById(user)
        const isConnected = currentUser.following.includes(connectedId);

        
        if(!isConnected){
            return res.status(404).json({message:"Connection not found"})
        }
        await User.findByIdAndUpdate(user,{
            $pull:{following:connectedId,followers:connectedId}
        })
        await User.findByIdAndUpdate(connectedId,{
            $pull:{following:user,followers:user}
        })
        await Relation.deleteMany({
            $or:[
                {sender:user,receiver:connectedId},
                {sender:connectedId,receiver:user}
            ]
        })
        res.status(200).json({message:"Connection Removed"});
    } catch (err) {
        console.log(err)
    }
}

const getMyConnections = async(req,res)=>{
    try{
        const userId = req.user

        const user = await User.findById(userId).populate("following","userName,bio,skills avatar")

        res.status(200).json(user.follwing)
    }catch(err){
        console.log(err)
    }
}
module.exports = { sendRequest, viewRequest, manageConnection,removeConnection,getMyConnections }