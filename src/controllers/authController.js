const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const AllowedUser = require('../models/userAcess')

// Configure Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_LOGIN_CLIENT_ID,
  clientSecret: process.env.GOOGLE_LOGIN_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_LOGIN_CALLBACK_URL,
  proxy: true,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value

    // Check if user already exists in DB
    let user = await User.findOne({ email })

    const isSuperAdmin = user?.role === 'superadmin'

    // Check allowlist unless superadmin
    const allowed = isSuperAdmin ? { role: 'superadmin' } : await AllowedUser.findOne({ email, isActive: true })
    if (!allowed) return done(null, false, { message: 'Access denied. Contact admin.' })

    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email,
        avatar: profile.photos[0]?.value,
        role: allowed.role,
      })
    } else {
      user.googleId = profile.id
      user.avatar = profile.photos[0]?.value
      if (!isSuperAdmin) user.role = allowed.role
      await user.save()
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
const authFailure = (req, res) => res.redirect(`${process.env.FRONTEND_URL}/auth/failure?message=Google authentication failed`);

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
