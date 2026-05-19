const express = require('express')
const multer = require('multer')
const { createTC, getAllTCs, getTCById, updateTC, deleteTC,  downloadTcByScholarNumber } = require('../controllers/tcController')

// accept both pdf and images for TC file
const tcUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Only PDF or image files are allowed'), false)
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
})

const router = express.Router()

router.post('/', tcUpload.single('tcFile'), createTC)
router.get('/', getAllTCs)
router.get('/scholar/:scholarNumber',downloadTcByScholarNumber)
router.get('/:id', getTCById)
router.put('/:id', tcUpload.single('tcFile'), updateTC)
router.delete('/:id', deleteTC)


module.exports = router
