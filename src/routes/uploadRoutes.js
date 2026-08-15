const express = require('express')
const { google } = require('googleapis')
const upload = require('../upload/multer')
const { protect } = require('../middleware/authMiddleware')
const {
  createDriveFolder, getDriveFolders, getFilesInFolder,
  uploadSingle, uploadMultiple, deleteFile,
  uploadBanner, getAllBanners, getBannerById, deleteBanner,
} = require('../controllers/uploadController')

const router = express.Router()

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin access required' })
  next()
}

// Temp debug route
router.get('/auth/debug', (req, res) => {
  res.json({
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID ? '✅ set' : '❌ missing',
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ? '✅ set' : '❌ missing',
    redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
  })
})

// One-time OAuth setup
router.get('/auth', (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT_URI
  )
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/drive'],
  })
  res.redirect(url)
})

router.get('/auth/callback', async (req, res) => {
  try {
    const { code, error } = req.query
    if (error) return res.status(400).json({ google_error: error })
    if (!code) return res.status(400).json({ message: 'No code in query' })
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      process.env.GOOGLE_OAUTH_REDIRECT_URI
    )
    const { tokens } = await oauth2Client.getToken(code)
    res.json({ message: 'Copy this refresh_token into your .env', refresh_token: tokens.refresh_token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Folder routes
router.post('/folder', createDriveFolder)
router.get('/folders', getDriveFolders)
router.get('/folder/:folderId/files', getFilesInFolder)

// General upload routes
router.post('/single', upload.single('image'), uploadSingle)
router.post('/multiple', upload.array('images', 30), uploadMultiple)

// Banner routes
router.post('/banner', protect, adminOnly, upload.single('image'), uploadBanner)
router.get('/banners', getAllBanners)
router.get('/banner/:id', getBannerById)
router.delete('/banner/:id', protect, deleteBanner)

// Delete drive file
router.delete('/:fileId', deleteFile)

module.exports = router
