const User = require('../models/User.model')

const getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.user

        const currentUser = await User.findById(currentUserId)

        if (!currentUser) {
            return res.status(404).json({ message: "User not found", users: [] })
        }

        const page = parseInt(req.query.page) || 1
        const limit = 10
        const skip = (page - 1) * limit
        const search = req.query.search || ""

        const users = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },
                { _id: { $nin: currentUser.blockedUsers || [] } },
                { userName: { $regex: search, $options: "i" } }
            ]
        })
        .select("-password -blockedUsers")
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })

        const totalUsers = await User.countDocuments({
            _id: { $ne: currentUserId },
            userName: { $regex: search, $options: "i" }
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

module.exports = getAllUsers
