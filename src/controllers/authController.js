const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Configure Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_LOGIN_CLIENT_ID,
  clientSecret: process.env.GOOGLE_LOGIN_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_LOGIN_CALLBACK_URL,
  proxy: true,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id })

    if (!user) {
      // Check if email already exists (manual signup before)
      user = await User.findOne({ email: profile.emails[0].value })
      if (user) {
        user.googleId = profile.id
        user.avatar = profile.photos[0]?.value
        await user.save()
      } else {
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0]?.value,
        })
      }
    }

    done(null, user)
  } catch (err) {
    done(err, null)
  }
}))

const generateToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })

// GET /api/auth/google
const googleLogin = passport.authenticate('google', { scope: ['profile', 'email'], session: false })

// GET /api/auth/google/callback
const googleCallback = [
  passport.authenticate('google', { session: false, failureRedirect: '/api/auth/failure' }),
  (req, res) => {
    const token = generateToken(req.user)
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/success?token=${token}`)
  },
]

// GET /api/auth/failure
const authFailure = (req, res) => res.status(401).json({ message: 'Google authentication failed' })

// GET /api/auth/me  (protected)
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-googleId')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { googleLogin, googleCallback, authFailure, getMe }
