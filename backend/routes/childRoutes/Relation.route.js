const router = require('express').Router()
const authMiddleware = require('../../middleware/auth')
const {sendRequest,viewRequest,removeConnection,manageConnection,getMyConnections} = require('../../controllers/Relation.controller')


router.post('/send/:id',authMiddleware,sendRequest);
router.post('/remove/:id',authMiddleware,removeConnection)
router.post('/:type/:id',authMiddleware,manageConnection)
router.get('/getMyRequests',authMiddleware,viewRequest)
router.get('/my',authMiddleware,getMyConnections)
module.exports = router