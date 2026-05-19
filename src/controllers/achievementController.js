const Achievement = require('../models/Achievement')
const { uploadToDrive, deleteFromDrive } = require('../upload/googleDrive')

// POST /api/achievement
const createAchievement = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image is required' })

    const uploaded = await uploadToDrive(req.file)
    const achievement = await Achievement.create({
      image: {
        fileId: uploaded.fileId,
        viewLink: uploaded.viewLink,
        directLink: uploaded.directLink,
      },
    })

    res.status(201).json({ message: 'Achievement created successfully', achievement })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/achievement
const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ createdAt: -1 })
    res.json({ count: achievements.length, achievements })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/achievement/:id
const getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id)
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' })
    res.json(achievement)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/achievement/:id
const updateAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id)
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' })
    if (!req.file) return res.status(400).json({ message: 'Image is required' })

    await deleteFromDrive(achievement.image.fileId)
    const uploaded = await uploadToDrive(req.file)

    const updated = await Achievement.findByIdAndUpdate(
      req.params.id,
      { image: { fileId: uploaded.fileId, viewLink: uploaded.viewLink, directLink: uploaded.directLink } },
      { new: true }
    )

    res.json({ message: 'Achievement updated successfully', achievement: updated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/achievement/:id
const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id)
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' })

    await deleteFromDrive(achievement.image.fileId)
    await Achievement.findByIdAndDelete(req.params.id)
    res.json({ message: 'Achievement deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { createAchievement, getAllAchievements, getAchievementById, updateAchievement, deleteAchievement }
