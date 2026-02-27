const router = require('express').Router()
const authMiddleware = require('../../middleware/auth.js')
const {addProject,getAllProjects,getMyProjects} = require('../../controllers/Project.controller.js')
router.post('/',authMiddleware,addProject)
router.get('/',authMiddleware,getAllProjects);
router.get('/my',authMiddleware,getMyProjects)
module.exports = router