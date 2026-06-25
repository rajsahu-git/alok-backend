const TransferCertificate = require('../models/TransferCertificate')
const { uploadToDrive, deleteFromDrive } = require('../upload/googleDrive')

// POST /api/tc
const createTC = async (req, res) => {
  try {
    const { scholarNumber, name, fatherName, dob, lastClass } = req.body

    if (!scholarNumber?.trim() )
      return res.status(400).json({ message: 'scholarNumber, name, fatherName, dob and lastClass are required' })
    if (!req.file) return res.status(400).json({ message: 'TC file is required' })

    const existing = await TransferCertificate.findOne({ scholarNumber: scholarNumber.trim() })
    if (existing) return res.status(400).json({ message: 'TC with this scholar number already exists' })

    const uploaded = await uploadToDrive(req.file, '15wMUeopO2iQHHEu5BPAefMolru9w77eh') 
    const tc = await TransferCertificate.create({
      scholarNumber: scholarNumber.trim(),
      name: name.trim(),
      fatherName: fatherName.trim(),
      dob: new Date(dob),
      lastClass: lastClass.trim(),
      tcFile: {
        fileId: uploaded.fileId,
        fileName: uploaded.fileName,
        viewLink: uploaded.viewLink,
        directLink: uploaded.directLink,
      },
    })

    res.status(201).json({ message: 'Transfer certificate created successfully', tc })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/tc
const getAllTCs = async (req, res) => {
  try {
    const { scholarNumber } = req.query
    const filter = {}
    if (scholarNumber) filter.scholarNumber = scholarNumber.trim()

    const tcs = await TransferCertificate.find(filter).sort({ createdAt: -1 })
    res.json({ count: tcs.length, tcs })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/tc/:id
const getTCById = async (req, res) => {
  try {
    const tc = await TransferCertificate.findById(req.params.id)
    if (!tc) return res.status(404).json({ message: 'Transfer certificate not found' })
    res.json(tc)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/tc/:id
const updateTC = async (req, res) => {
  try {
    const tc = await TransferCertificate.findById(req.params.id)
    if (!tc) return res.status(404).json({ message: 'Transfer certificate not found' })

    const { scholarNumber, name, fatherName, dob, lastClass } = req.body
    const updateData = {}

    if (scholarNumber?.trim()) updateData.scholarNumber = scholarNumber.trim()
    if (name?.trim()) updateData.name = name.trim()
    if (fatherName?.trim()) updateData.fatherName = fatherName.trim()
    if (dob) updateData.dob = new Date(dob)
    if (lastClass?.trim()) updateData.lastClass = lastClass.trim()

    if (req.file) {
      await deleteFromDrive(tc.tcFile.fileId)
      const uploaded = await uploadToDrive(req.file, '15wMUeopO2iQHHEu5BPAefMolru9w77eh')
      updateData.tcFile = {
        fileId: uploaded.fileId,
        fileName: uploaded.fileName,
        viewLink: uploaded.viewLink,
        directLink: uploaded.directLink,
      }
    }

    const updated = await TransferCertificate.findByIdAndUpdate(req.params.id, updateData, { new: true })
    res.json({ message: 'Transfer certificate updated successfully', tc: updated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/tc/:id
const deleteTC = async (req, res) => {
  try {
    const tc = await TransferCertificate.findById(req.params.id)
    if (!tc) return res.status(404).json({ message: 'Transfer certificate not found' })

    await deleteFromDrive(tc.tcFile.fileId)
    await TransferCertificate.findByIdAndDelete(req.params.id)
    res.json({ message: 'Transfer certificate deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}



// GET /api/tc/scholar/:scholarNumber/download
const downloadTcByScholarNumber = async (req, res) => {
  try {
    const tc = await TransferCertificate.findOne({ scholarNumber: req.params.scholarNumber.trim() })
    if (!tc) return res.status(404).json({ message: 'Transfer certificate not found' })
    res.redirect(`https://drive.google.com/uc?export=download&id=${tc.tcFile.fileId}`)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { createTC, getAllTCs, getTCById, updateTC, deleteTC,  downloadTcByScholarNumber }
