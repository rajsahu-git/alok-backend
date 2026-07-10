const express = require('express')
const multer = require('multer')
const uploadPdf = require('../upload/multerPdf')
const {
  createMandatoryDisclosure,
  getAllMandatoryDisclosures,
  getActiveMandatoryDisclosure,
  getMandatoryDisclosureById,
  updateMandatoryDisclosure,
  deleteMandatoryDisclosure,
} = require('../controllers/mandatoryDisclosureController')

const router = express.Router()

const handleUpload = (req, res, next) => {
  uploadPdf.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError)
      return res.status(400).json({ message: `Upload error: ${err.message}` })
    if (err) return res.status(400).json({ message: err.message })
    next()
  })
}

router.post('/', handleUpload, createMandatoryDisclosure)
router.get('/', getAllMandatoryDisclosures)
router.get('/active', getActiveMandatoryDisclosure)
router.get('/:id', getMandatoryDisclosureById)
router.put('/:id', handleUpload, updateMandatoryDisclosure)
router.delete('/:id', deleteMandatoryDisclosure)

module.exports = router
