const router = require("express").Router()
const { getNotifications } = require("../../controllers/Notification.controller")
const { verifyToken } = require("../../middleware/auth.middleware")

router.get("/", verifyToken, getNotifications)

module.exports = router