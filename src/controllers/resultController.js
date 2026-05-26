const Result = require('../models/Result')
const { uploadToDrive, deleteFromDrive } = require('../upload/googleDrive')

// POST /api/result
const createResult = async (req, res) => {
  try {
    const { studentName, sessionYear, percentage, studentClass, stream } = req.body
    if (!studentName?.trim() || !sessionYear?.trim() || !percentage || !studentClass?.trim())
      return res.status(400).json({ message: 'studentName, sessionYear, percentage and studentClass are required' })
    if (studentClass === '12th' && !stream?.trim())
      return res.status(400).json({ message: 'stream is required for class 12th' })
    if (!req.file) return res.status(400).json({ message: 'Student image is required' })

    const uploaded = await uploadToDrive(req.file,"1TxEtIFQ5a2nCKjw3Rd3wZIoBe_mUbp8L")
    const result = await Result.create({
      studentName: studentName.trim(),
      sessionYear: sessionYear.trim(),
      percentage: Number(percentage),
      studentClass: studentClass.trim(),
      stream: studentClass === '12th' ? stream.trim() : null,
      image: {
        fileId: uploaded.fileId,
        viewLink: uploaded.viewLink,
        directLink: uploaded.directLink,
      },
    })

    res.status(201).json({ message: 'Result created successfully', result })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/result
const getAllResults = async (req, res) => {
  try {
    const { sessionYear, studentClass } = req.query
    const filter = {}
    if (sessionYear) filter.sessionYear = sessionYear
    if (studentClass) filter.studentClass = studentClass

    const results = await Result.find(filter).sort({ percentage: -1 })
    res.json({ count: results.length, results })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/result/:id
const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
    if (!result) return res.status(404).json({ message: 'Result not found' })
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/result/:id
const updateResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
    if (!result) return res.status(404).json({ message: 'Result not found' })

    const { studentName, sessionYear, percentage, studentClass, stream } = req.body
    const updateData = {}

    if (studentName?.trim()) updateData.studentName = studentName.trim()
    if (sessionYear?.trim()) updateData.sessionYear = sessionYear.trim()
    if (percentage) updateData.percentage = Number(percentage)
    if (studentClass?.trim()) {
      updateData.studentClass = studentClass.trim()
      updateData.stream = studentClass === '12th' ? (stream?.trim() || null) : null
    }

    if (req.file) {
      await deleteFromDrive(result.image.fileId)
      const uploaded = await uploadToDrive(req.file, "1TxEtIFQ5a2nCKjw3Rd3wZIoBe_mUbp8L")
      updateData.image = {
        fileId: uploaded.fileId,
        viewLink: uploaded.viewLink,
        directLink: uploaded.directLink,
      }
    }

    const updated = await Result.findByIdAndUpdate(req.params.id, updateData, { new: true })
    res.json({ message: 'Result updated successfully', result: updated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/result/:id
const deleteResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
    if (!result) return res.status(404).json({ message: 'Result not found' })

    await deleteFromDrive(result.image.fileId)
    await Result.findByIdAndDelete(req.params.id)
    res.json({ message: 'Result deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { createResult, getAllResults, getResultById, updateResult, deleteResult }
