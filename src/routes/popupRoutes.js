const express = require('express')
const multer = require('multer')
const upload = require('../upload/multer')
const { createPopup, getAllPopups, getActivePopup, getPopupById, updatePopup, deletePopup } = require('../controllers/popupController')

const router = express.Router()

const handleUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError)
      return res.status(400).json({ message: `Upload error: ${err.message}` })
    if (err) return res.status(400).json({ message: err.message })
    next()
  })
}

router.post('/', handleUpload, createPopup)
router.get('/', getAllPopups)
router.get('/active', getActivePopup)
router.get('/:id', getPopupById)
router.put('/:id', handleUpload, updatePopup)
router.delete('/:id', deletePopup)

module.exports = router
