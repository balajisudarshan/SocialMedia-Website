const router = require('express').Router()
const authRouter = require('./childRoutes/Auth.route')
const userRouter = require('./childRoutes/User.route')

router.use('/auth', authRouter)
router.use('/user', userRouter)

module.exports = router