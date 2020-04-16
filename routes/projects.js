const express = require('express')
const projectController = require('../controllers/projectController')
const authMiddleware = require('../middleware/auth')
const { multerUploads } = require('../config/multer')
const projectMiddleware = require('../middleware/project')

const router = express.Router()

router.get('/',
  projectController.list
)

router.get('/all',
  // authMiddleware.requireJWT,
  projectController.listAll
)

router.get('/tags/:tags',
  projectController.listTags
)

router.post('/create', 
// authMiddleware.requireJWT, 
multerUploads, 
projectController.create
)

router.get('/:projectId',
// authMiddleware.requireJWT, 
projectMiddleware.retrieveProject,
projectController.read
)

router.put('/:projectId',
// authMiddleware.requireJWT, 
multerUploads,
projectMiddleware.retrieveProject,
projectController.update
)

router.delete('/:projectId',
// authMiddleware.requireJWT,
projectMiddleware.retrieveProject, 
projectController.destroy
)





// router.post('/upload',
// multerUploads, (req, res) => {

//   console.log('req.body :', req.body)

//   console.log('req.files', req.files)

//   res.send('yeeting')

// })


module.exports = router