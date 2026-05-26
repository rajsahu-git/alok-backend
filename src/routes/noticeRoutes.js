const express = require('express')
const multer = require('multer')
const { createNotice, getAllNotices, getNoticeById, updateNotice, deleteNotice } = require('../controllers/noticeController')

const noticeUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedImages = ['image/jpeg', 'image/png', 'image/webp']
    const allowedPdf = ['application/pdf']
    if (file.fieldname === 'image' && allowedImages.includes(file.mimetype)) return cb(null, true)
    if (file.fieldname === 'pdf' && allowedPdf.includes(file.mimetype)) return cb(null, true)
    cb(new Error('image must be jpeg/png/webp and pdf must be a PDF file'), false)
  },
  limits: { fileSize: 50 * 1024 * 1024 },
})

const uploadFields = noticeUpload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
])

const handleUpload = (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err instanceof multer.MulterError)
      return res.status(400).json({ message: `Upload error: ${err.message}` })
    if (err) return res.status(400).json({ message: err.message })
    next()
  })
}

const router = express.Router()

router.post('/', handleUpload, createNotice)
router.get('/', getAllNotices)
router.get('/:id', getNoticeById)
router.put('/:id', handleUpload, updateNotice)
router.delete('/:id', deleteNotice)

module.exports = router
