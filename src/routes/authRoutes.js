const express = require('express')
const passport = require('passport')
const { protect } = require('../middleware/authMiddleware')
const { googleLogin, googleCallback, authFailure, getMe } = require('../controllers/authController')

// Initialize passport (no session needed)
require('../controllers/authController')

const router = express.Router()

router.get('/google', googleLogin)
router.get('/google/callback', ...googleCallback)
router.get('/failure', authFailure)
router.get('/me', protect, getMe)

module.exports = router



