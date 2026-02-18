const router = require('express').Router()
const authRouter = require('./childRoutes/Auth.route')
const userRouter = require('./childRoutes/User.route')
const relationRouter = require('./childRoutes/Relation.route')
router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/connection',relationRouter)
module.exports = router