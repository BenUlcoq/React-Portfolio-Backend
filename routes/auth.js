const express = require('express')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// Register
router.post(
  '/register',
  authMiddleware.requireJWT,
  // middleware that handles the registration process
  authMiddleware.register,
  // json handler
  authMiddleware.signJWTForUser
)

// Sign in
router.post(
  '/',  
  // middleware that handles the sign in process
  authMiddleware.signIn,
  // json handler
  authMiddleware.signJWTForUser
)

router.get(
  '/verify',
  authMiddleware.requireJWT
)

module.exports = router
