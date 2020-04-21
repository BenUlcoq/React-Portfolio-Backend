const express = require('express')
const authMiddleware = require('../middleware/auth')
const { multerUploads } = require('../config/multer')
const mediaController = require('../controllers/mediaController')

const router = express.Router()

router.get('/',
  // authMiddleware.requireJWT,
  mediaController.list
)

router.get('/:mediaId',
  // authMiddleware.requireJWT,
  mediaController.read
)

router.delete('/:mediaId',
  // authMiddleware.requireJWT,
  mediaController.destroy
)

router.put('/:mediaId',
  // authMiddleware.requireJWT,
  mediaController.update
)

router.post('/',
  // authMiddleware.requireJWT,
  multerUploads,
  mediaController.create
)

module.exports = router