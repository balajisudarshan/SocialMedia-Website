const router = require('express').Router()
const { registerUser, loginUser, me,updateProfile, logout } = require('../../controllers/Auth.controller')
const authMiddleware = require('../../middleware/auth')

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/logout',logout)
router.get('/me',authMiddleware,me)
router.put('/update/',authMiddleware,updateProfile)

module.exports = router