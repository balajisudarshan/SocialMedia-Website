const router = require('express').Router()
const authMiddleware = require('../../middleware/auth')
const {sendRequest,viewRequest} = require('../../controllers/Relation.controller')


router.post('/send/:id',authMiddleware,sendRequest);
router.get('/getMyRequests',authMiddleware,viewRequest)
module.exports = router