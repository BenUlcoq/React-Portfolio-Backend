const express = require('express')
const projectController = require('../controllers/projectController')
const authMiddleware = require('../middleware/auth')
const { multerUploads } = require('../config/multer')
const projectMiddleware = require('../middleware/project')
const mediaController = require('../controllers/mediaController')

const router = express.Router()

router.get('/tags/:tags?',
  projectController.listTags
)

router.get('/',
  projectController.listTags
)

router.get('/all',
  // authMiddleware.requireJWT,
  projectController.listAll
)

router.post('/create', 
// authMiddleware.requireJWT, 
multerUploads,
projectController.validate,
mediaController.create,
projectController.create
)

router.get('/:projectId',
// authMiddleware.requireJWT, 
projectController.read
)

router.put('/:projectId',
// authMiddleware.requireJWT, 
multerUploads,
projectController.validate,
mediaController.create,
projectMiddleware.retrieveProject,
projectController.update
)

router.delete('/:projectId',
// authMiddleware.requireJWT,
projectMiddleware.retrieveProject, 
projectController.destroy
)

router.get('/admin/:projectId',
// authMiddleware.requireJWT, 
projectController.edit
)





// router.post('/upload',
// multerUploads, (req, res) => {

//   console.log('req.body :', req.body)

//   console.log('req.files', req.files)

//   res.send('yeeting')

// })


module.exports = router