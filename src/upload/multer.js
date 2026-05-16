const multer = require('multer')

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (allowed.includes(file.mimetype)) cb(null, true)
  else cb(new Error('Only image files are allowed (jpeg, png, webp, gif)'), false)
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,   // 5MB per file
    fieldSize: 20 * 1024 * 1024, // 20MB per text field (for blog HTML with embedded images)
  },
})

module.exports = upload
