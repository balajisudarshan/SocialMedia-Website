const router = require('express').Router()
const { registerUser, loginUser, me } = require('../../controllers/Auth.controller')
const authMiddleware = require('../../middleware/auth')

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/me',authMiddleware,me)

module.exports = router