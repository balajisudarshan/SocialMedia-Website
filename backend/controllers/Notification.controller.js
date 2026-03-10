const Notification = require("../models/Notification.model");

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ receiver: req.user }).populate('sender', 'userName avatar').sort({ createdAt: -1 });
        res.status(200).json({ notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateNotification = async (req, res) => {
    const { notificationId } = req.params;

    try {
        await Notification.findByIdAndUpdate(notificationId, { read: true });
        return res.status(200).json({message:"marked as read"})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}
module.exports = {
    getNotifications,
    updateNotification
}