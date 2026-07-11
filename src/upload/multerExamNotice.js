const multer = require('multer')

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'pdf') {
    if (file.mimetype === 'application/pdf') return cb(null, true)
    return cb(new Error('pdf field must be a PDF file'), false)
  }
  if (file.fieldname === 'image') {
    if (allowedImageTypes.includes(file.mimetype)) return cb(null, true)
    return cb(new Error('image field must be jpeg, png, webp or gif'), false)
  }
  cb(new Error('Unexpected field'), false)
}

const uploadExamNoticeFiles = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'image', maxCount: 1 },
])

module.exports = uploadExamNoticeFiles
