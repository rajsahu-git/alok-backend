const multer = require('multer')

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true)
  else cb(new Error('Only PDF files are allowed'), false)
}

const uploadPdf = multer({
  storage: multer.memoryStorage(),
  fileFilter: pdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
})

module.exports = uploadPdf
