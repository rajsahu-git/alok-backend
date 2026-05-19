const express = require('express')
const multer = require('multer')
const { createCareerApplication, getAllApplications, getApplicationById, updateApplicationStatus, deleteApplication } = require('../controllers/careerController')

const careerUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedResume = ['application/pdf']
    const allowedPhoto = ['image/jpeg', 'image/png', 'image/webp']
    if (file.fieldname === 'resume' && allowedResume.includes(file.mimetype)) return cb(null, true)
    if (file.fieldname === 'passportPhoto' && allowedPhoto.includes(file.mimetype)) return cb(null, true)
    cb(new Error('resume must be PDF, passportPhoto must be an image'), false)
  },
  limits: { fileSize: 10 * 1024 * 1024 },
})

const uploadFields = careerUpload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'passportPhoto', maxCount: 1 },
])

const router = express.Router()

router.post('/', uploadFields, createCareerApplication)
router.get('/', getAllApplications)
router.get('/:id', getApplicationById)
router.patch('/:id/status', updateApplicationStatus)
router.delete('/:id', deleteApplication)

module.exports = router