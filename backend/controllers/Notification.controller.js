const Notification = require("../models/Notification.model");

const getNotifications = async(req,res)=>{
    try {
        const notifications = await Notification.find({ recipient: req.user }).populate('sender', 'userName profilePic').sort({ createdAt: -1 });
        res.status(200).json({ notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
module.exports = {
    getNotifications
}