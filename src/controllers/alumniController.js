const Alumni = require('../models/Alumni')
const { uploadToDrive, deleteFromDrive } = require('../upload/googleDrive')


const createAlumni = async (req, res) => {
  try {
    const { name, batch, currentPosition, linkedin, github, twitter } = req.body
    if (!name?.trim() || !batch?.trim() || !currentPosition?.trim())
      return res.status(400).json({ message: 'name, batch and currentPosition are required' })
    if (!req.file) return res.status(400).json({ message: 'image is required' })

    const uploaded = await uploadToDrive(req.file,'1pP1LTgVPHqaY-9O9jRHzh03FoHuwT9Xt')
    const newAlumni = await Alumni.create({
      name: name.trim(),
      batch: batch.trim(),
      currentPosition: currentPosition.trim(),
      linkedin,
      github,
      twitter,
      image: uploaded
    })
    res.status(201).json(newAlumni)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}


const getAlumni = async (req, res) => {
  try {
    const alumniList = await Alumni.find().sort({ createdAt: -1 })
    res.status(200).json(alumniList)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const deleteAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id)
    if (!alumni) return res.status(404).json({ message: 'Alumni not found' })
    await deleteFromDrive(alumni.image.fileId)
    await Alumni.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Alumni deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const updateAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id)
    if (!alumni) return res.status(404).json({ message: 'Alumni not found' })
    const { name, batch, currentPosition, linkedin, github, twitter } = req.body
    const updateData = {}
    if (name?.trim()) updateData.name = name.trim()
    if (batch?.trim()) updateData.batch = batch.trim()
    if (currentPosition?.trim()) updateData.currentPosition = currentPosition.trim()
    if (linkedin) updateData.linkedin = linkedin
    if (github) updateData.github = github
    if (twitter) updateData.twitter = twitter
    if (req.file) {
      await deleteFromDrive(alumni.image.fileId)
      const uploaded = await uploadToDrive(req.file ,'1pP1LTgVPHqaY-9O9jRHzh03FoHuwT9Xt')
      updateData.image = uploaded
    }
    const updatedAlumni = await Alumni.findByIdAndUpdate(req.params.id, updateData, { new: true })
    res.status(200).json(updatedAlumni)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = { createAlumni, getAlumni, deleteAlumni, updateAlumni }