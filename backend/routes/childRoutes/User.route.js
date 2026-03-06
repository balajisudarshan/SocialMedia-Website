const router = require("express").Router()
const {getAllUsers,getSingleUser} = require("../../controllers/User.controller")
const authMiddleware = require('../../middleware/auth')
router.get("/", authMiddleware, getAllUsers)
router.get("/:id",authMiddleware,getSingleUser);
module.exports = router