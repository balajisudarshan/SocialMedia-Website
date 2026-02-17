const router = require("express").Router()
const getAllUsers = require("../../controllers/User.controller")
const authMiddleware = require('../../middleware/auth')
router.get("/", authMiddleware, getAllUsers)
module.exports = router