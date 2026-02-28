const router = require('express').Router()
const authMiddleware = require('../../middleware/auth.js')
const {addProject,getAllProjects,getMyProjects,sendProjectRequest,getProjectRequests,getMyWork} = require('../../controllers/Project.controller.js')
router.post('/',authMiddleware,addProject)

router.get('/',authMiddleware,getAllProjects);
router.get('/my',authMiddleware,getMyProjects)
router.get('/my/work',authMiddleware,getMyWork)
router.post('/request/:id',authMiddleware,sendProjectRequest)

router.get('/:id/requests',authMiddleware,getProjectRequests)
module.exports = router