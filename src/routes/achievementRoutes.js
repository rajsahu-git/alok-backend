const express = require('express')
const multer = require('multer')
const upload = require('../upload/multer')
const { createAchievement, getAllAchievements, getAchievementById, updateAchievement, deleteAchievement } = require('../controllers/achievementController')

const router = express.Router()

const handleUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError)
      return res.status(400).json({ message: `Upload error: ${err.message}` })
    if (err) return res.status(400).json({ message: err.message })
    next()
  })
}

router.post('/', handleUpload, createAchievement)
router.get('/', getAllAchievements)
router.get('/:id', getAchievementById)
router.put('/:id', handleUpload, updateAchievement)
router.delete('/:id', deleteAchievement)

module.exports = router
