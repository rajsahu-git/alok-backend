const MandatoryDisclosure = require('../models/MandatoryDisclosure')
const { uploadToDrive, deleteFromDrive } = require('../upload/googleDrive')

// POST /api/mandatory-disclosure
const createMandatoryDisclosure = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'PDF file is required' })

    const isActive = req.body.isActive === 'false' ? false : true
    const uploaded = await uploadToDrive(req.file)

    if (isActive) await MandatoryDisclosure.updateMany({}, { isActive: false })

    const disclosure = await MandatoryDisclosure.create({
      title: req.body.title?.trim(),
      file: {
        fileId: uploaded.fileId,
        fileName: uploaded.fileName,
        viewLink: uploaded.viewLink,
        directLink: uploaded.directLink,
      },
      isActive,
    })

    res.status(201).json({ message: 'Mandatory disclosure created successfully', disclosure })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/mandatory-disclosure
const getAllMandatoryDisclosures = async (req, res) => {
  try {
    const disclosures = await MandatoryDisclosure.find().sort({ createdAt: -1 })
    res.json({ count: disclosures.length, disclosures })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/mandatory-disclosure/active — frontend uses this for the button link
const getActiveMandatoryDisclosure = async (req, res) => {
  try {
    const disclosure = await MandatoryDisclosure.findOne({ isActive: true }).sort({ createdAt: -1 })
    if (!disclosure) return res.status(404).json({ message: 'No active mandatory disclosure found' })
    res.json(disclosure)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/mandatory-disclosure/:id
const getMandatoryDisclosureById = async (req, res) => {
  try {
    const disclosure = await MandatoryDisclosure.findById(req.params.id)
    if (!disclosure) return res.status(404).json({ message: 'Mandatory disclosure not found' })
    res.json(disclosure)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/mandatory-disclosure/:id
const updateMandatoryDisclosure = async (req, res) => {
  try {
    const disclosure = await MandatoryDisclosure.findById(req.params.id)
    if (!disclosure) return res.status(404).json({ message: 'Mandatory disclosure not found' })

    const updateData = {}

    if (req.body.title !== undefined) updateData.title = req.body.title.trim()

    if (req.body.isActive !== undefined) {
      updateData.isActive = req.body.isActive === 'true' || req.body.isActive === true
      if (updateData.isActive) await MandatoryDisclosure.updateMany({ _id: { $ne: disclosure._id } }, { isActive: false })
    }

    if (req.file) {
      await deleteFromDrive(disclosure.file.fileId)
      const uploaded = await uploadToDrive(req.file)
      updateData.file = {
        fileId: uploaded.fileId,
        fileName: uploaded.fileName,
        viewLink: uploaded.viewLink,
        directLink: uploaded.directLink,
      }
    }

    const updated = await MandatoryDisclosure.findByIdAndUpdate(req.params.id, updateData, { new: true })
    res.json({ message: 'Mandatory disclosure updated successfully', disclosure: updated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/mandatory-disclosure/:id
const deleteMandatoryDisclosure = async (req, res) => {
  try {
    const disclosure = await MandatoryDisclosure.findById(req.params.id)
    if (!disclosure) return res.status(404).json({ message: 'Mandatory disclosure not found' })

    await deleteFromDrive(disclosure.file.fileId)
    await MandatoryDisclosure.findByIdAndDelete(req.params.id)
    res.json({ message: 'Mandatory disclosure deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  createMandatoryDisclosure,
  getAllMandatoryDisclosures,
  getActiveMandatoryDisclosure,
  getMandatoryDisclosureById,
  updateMandatoryDisclosure,
  deleteMandatoryDisclosure,
}
