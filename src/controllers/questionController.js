const QuestionBank = require('../models/QuestionBank')
const { uploadToDrive, deleteFromDrive } = require('../upload/googleDrive')

// POST /api/QuestionBank
const createQuestionBank = async (req, res) => {
  try {
    const { title, questionBankClass } = req.body
    if (!title?.trim()) return res.status(400).json({ message: 'title is required' })

    const QuestionBankData = {
      title: title.trim(),
      class: questionBankClass?.trim(),
    }

    if (req.files?.pdf?.[0]) {
      const uploaded = await uploadToDrive(req.files.pdf[0],"1HApjv9BDU3x230B1NWohWuJ7WZTNwfBu")
      QuestionBankData.pdf = { fileId: uploaded.fileId, fileName: uploaded.fileName, viewLink: uploaded.viewLink, directLink: uploaded.directLink }
    }

    const questionBank = await QuestionBank.create(QuestionBankData)
    res.status(201).json({ message: 'QuestionBank created successfully', questionBank })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/QuestionBank
const getAllQuestionBanks = async (req, res) => {
  try {
    const { questionBankClass } = req.query
    const filter = {}
    if (questionBankClass) filter.class = questionBankClass.trim()

    const QuestionBanks = await QuestionBank.find(filter).sort({ createdAt: -1 })
    res.json({ count: QuestionBanks.length, QuestionBanks })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/QuestionBank/:id
const getQuestionBankById = async (req, res) => {
  try {
    const QuestionBank = await QuestionBank.findById(req.params.id)
    if (!QuestionBank) return res.status(404).json({ message: 'QuestionBank not found' })
    res.json(QuestionBank)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/QuestionBank/:id
const updateQuestionBank = async (req, res) => {
  try {
    const questionBank = await QuestionBank.findById(req.params.id)
    if (!questionBank) return res.status(404).json({ message: 'QuestionBank not found' })

    const { title, questionBankClass, isActive } = req.body
    const updateData = {}

    if (title?.trim()) updateData.title = title.trim()
    if (questionBankClass?.trim()) updateData.class = questionBankClass.trim()
    if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true



    if (req.files?.pdf?.[0]) {
      if (QuestionBank.pdf?.fileId) await deleteFromDrive(QuestionBank.pdf.fileId)
      const uploaded = await uploadToDrive(req.files.pdf[0], "1HApjv9BDU3x230B1NWohWuJ7WZTNwfBu")
      updateData.pdf = { fileId: uploaded.fileId, fileName: uploaded.fileName, viewLink: uploaded.viewLink, directLink: uploaded.directLink }
    }

    const updated = await QuestionBank.findByIdAndUpdate(req.params.id, updateData, { new: true })
    res.json({ message: 'QuestionBank updated successfully', QuestionBank: updated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/QuestionBank/:id
const deleteQuestionBank = async (req, res) => {
  try {
    const questionBank = await QuestionBank.findById(req.params.id)
    if (!questionBank) return res.status(404).json({ message: 'QuestionBank not found' })

    if (questionBank.image?.fileId) await deleteFromDrive(questionBank.image.fileId)
    if (questionBank.pdf?.fileId) await deleteFromDrive(questionBank.pdf.fileId)
    await QuestionBank.findByIdAndDelete(req.params.id)
    res.json({ message: 'QuestionBank deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { createQuestionBank, getAllQuestionBanks, getQuestionBankById, updateQuestionBank, deleteQuestionBank }
