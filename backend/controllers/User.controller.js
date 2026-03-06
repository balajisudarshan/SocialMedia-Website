const User = require('../models/User.model')
const Relations = require('../models/Relation.model')
const getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.user

        const currentUser = await User.findById(currentUserId)

        if (!currentUser) {
            return res.status(404).json({ message: "User not found", users: [] })
        }

        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit
        const search = req.query.search || ""

        const pendingRequest = await Relations.find({
            sender:currentUserId,
            status:"pending"
        }).select("receiver")

        const requestedUserIds = pendingRequest.map(r => r.receiver)

        const users = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },
                { _id: { $nin: currentUser.blockedUsers || [] } },
                { blockedUsers: { $ne: currentUserId } },
                {_id : {$nin:requestedUserIds}},
                { userName: { $regex: search, $options: "i" } }
            ]
        })
            .select("-password -blockedUsers")
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 })

        const totalUsers = await User.countDocuments({
            $and: [
                { _id: { $ne: currentUserId } },
                { _id: { $nin: currentUser.blockedUsers || [] } },
                { blockedUsers: { $ne: currentUserId } },
                { userName: { $regex: search, $options: "i" } }
            ]
        })
        
        return res.status(200).json({
            page,
            totalPages: Math.ceil(totalUsers / limit),
            users: users || []
        })

    } catch (err) {
        res.status(500).json({ message: err.message, users: [] })
    }
}

const getSingleUser = async(req,res)=>{
    const {id} = req.params
    try{
        const user = await User.findById(id)
        console.log(id)
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        return res.status(200).json({user})
    }catch(err){
        console.log(err)
        return res.status(500).json({err})
    }
}

module.exports = {getAllUsers,getSingleUser}
