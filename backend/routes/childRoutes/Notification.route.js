const router = require("express").Router()
const { getNotifications,updateNotification } = require("../../controllers/Notification.controller")
const authMiddleware = require('../../middleware/auth')


router.get("/", authMiddleware, getNotifications)
router.patch("/:notificationId/read", authMiddleware, updateNotification)

module.exports = router