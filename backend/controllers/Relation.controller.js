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
const viewRequest = async(req,res)=>{
    try{
        const userId = req.user
        const requests = await Relation.find({
            receiver:userId,
            status:"pending"
        }).populate("sender","userName bio skills")
        res.status(200).json({requests})
    }catch(error){
        console.error(error)
    }
}

module.exports = {sendRequest,viewRequest}