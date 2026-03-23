const {sendInvite,getInvites} = require("../../controllers/Invite.controller")
const express = require("express")
const router = express.Router()
const authMiddleware = require("../../middleware/auth")

router.post('/send',authMiddleware,sendInvite)
router.get('/',authMiddleware,getInvites)
module.exports = router