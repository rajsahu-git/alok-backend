const express = require('express')
const multer = require('multer')
const upload = require('../upload/multer')
const { createResult, getAllResults, getResultById, updateResult, deleteResult } = require('../controllers/resultController')

const router = express.Router()

const handleUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError)
      return res.status(400).json({ message: `Upload error: ${err.message}` })
    if (err) return res.status(400).json({ message: err.message })
    next()
  })
}

router.post('/', handleUpload, createResult)
router.get('/', getAllResults)
router.get('/:id', getResultById)
router.put('/:id', handleUpload, updateResult)
router.delete('/:id', deleteResult)



module.exports = router
