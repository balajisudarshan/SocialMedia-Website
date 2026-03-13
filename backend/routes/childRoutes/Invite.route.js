const sendInvite = require("../../controllers/Invite.controller")
const express = require("express")
const router = express.Router()
const authMiddleware = require("../../middleware/auth")

router.post('/send',authMiddleware,sendInvite)

module.exports = router