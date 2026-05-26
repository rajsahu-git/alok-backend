const Popup = require('../models/Popup')
const { uploadToDrive, deleteFromDrive } = require('../upload/googleDrive')

// POST /api/popup
const createPopup = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image is required' })

    const uploaded = await uploadToDrive(req.file)
    const popup = await Popup.create({
      image: {
        fileId: uploaded.fileId,
        viewLink: uploaded.viewLink,
        directLink: uploaded.directLink,
      },
      isActive: req.body.isActive === 'false' ? false : true,
    })

    res.status(201).json({ message: 'Popup created successfully', popup })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/popup
const getAllPopups = async (req, res) => {
  try {
    const popups = await Popup.find().sort({ createdAt: -1 })
    const showPop = popups.some((p) => p.isActive === true)
    res.json({ count: popups.length, showPop, popups })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/popup/active  — frontend uses this to show popup
const getActivePopup = async (req, res) => {
  try {
    const popup = await Popup.findOne({ isActive: true }).sort({ createdAt: -1 })
    if (!popup) return res.status(404).json({ message: 'No active popup found' })
    res.json(popup)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/popup/:id
const getPopupById = async (req, res) => {
  try {
    const popup = await Popup.findById(req.params.id)
    if (!popup) return res.status(404).json({ message: 'Popup not found' })
    res.json(popup)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/popup/:id
const updatePopup = async (req, res) => {
  try {
    const popup = await Popup.findById(req.params.id)
    if (!popup) return res.status(404).json({ message: 'Popup not found' })

    const updateData = {}

    if (req.body.isActive !== undefined)
      updateData.isActive = req.body.isActive === 'true' || req.body.isActive === true

    if (req.file) {
      await deleteFromDrive(popup.image.fileId)
      const uploaded = await uploadToDrive(req.file)
      updateData.image = {
        fileId: uploaded.fileId,
        viewLink: uploaded.viewLink,
        directLink: uploaded.directLink,
      }
    }

    const updated = await Popup.findByIdAndUpdate(req.params.id, updateData, { new: true })
    res.json({ message: 'Popup updated successfully', popup: updated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/popup/:id
const deletePopup = async (req, res) => {
  try {
    const popup = await Popup.findById(req.params.id)
    if (!popup) return res.status(404).json({ message: 'Popup not found' })

    await deleteFromDrive(popup.image.fileId)
    await Popup.findByIdAndDelete(req.params.id)
    res.json({ message: 'Popup deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { createPopup, getAllPopups, getActivePopup, getPopupById, updatePopup, deletePopup }
