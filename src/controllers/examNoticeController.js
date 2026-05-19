const ExamNotice = require('../models/ExamNotice')
const { uploadToDrive, deleteFromDrive } = require('../upload/googleDrive')

// POST /api/exam-notice
const createExamNotice = async (req, res) => {
  try {
    const { title, examDateFrom, examDateTo, description } = req.body
    if (!title?.trim() || !examDateFrom || !examDateTo || !description?.trim())
      return res.status(400).json({ message: 'title, examDateFrom, examDateTo and description are required' })
    if (!req.file) return res.status(400).json({ message: 'PDF file is required' })

    const uploaded = await uploadToDrive(req.file,'1YxWtKYEpwPUCxwd9d7GbkAtxxHQdnaBV')
    const notice = await ExamNotice.create({
      title: title.trim(),
      examDateFrom: new Date(examDateFrom),
      examDateTo: new Date(examDateTo),
      description: description.trim(),
      pdf: {
        fileId: uploaded.fileId,
        fileName: uploaded.fileName,
        viewLink: uploaded.viewLink,
        directLink: uploaded.directLink,
      },
    })

    res.status(201).json({ message: 'Exam notice created successfully', notice })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/exam-notice
const getAllExamNotices = async (req, res) => {
  try {
    const notices = await ExamNotice.find().sort({ createdAt: -1 })
    res.json({ count: notices.length, notices })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/exam-notice/:id
const getExamNoticeById = async (req, res) => {
  try {
    const notice = await ExamNotice.findById(req.params.id)
    if (!notice) return res.status(404).json({ message: 'Exam notice not found' })
    res.json(notice)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/exam-notice/:id
const updateExamNotice = async (req, res) => {
  try {
    const notice = await ExamNotice.findById(req.params.id)
    if (!notice) return res.status(404).json({ message: 'Exam notice not found' })

    const { title, examDateFrom, examDateTo, description } = req.body
    const updateData = {}

    if (title?.trim()) updateData.title = title.trim()
    if (examDateFrom) updateData.examDateFrom = new Date(examDateFrom)
    if (examDateTo) updateData.examDateTo = new Date(examDateTo)
    if (description?.trim()) updateData.description = description.trim()

    if (req.file) {
      await deleteFromDrive(notice.pdf.fileId)
      const uploaded = await uploadToDrive(req.file, '1YxWtKYEpwPUCxwd9d7GbkAtxxHQdnaBV')
      updateData.pdf = {
        fileId: uploaded.fileId,
        fileName: uploaded.fileName,
        viewLink: uploaded.viewLink,
        directLink: uploaded.directLink,
      }
    }

    const updated = await ExamNotice.findByIdAndUpdate(req.params.id, updateData, { new: true })
    res.json({ message: 'Exam notice updated successfully', notice: updated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/exam-notice/:id
const deleteExamNotice = async (req, res) => {
  try {
    const notice = await ExamNotice.findById(req.params.id)
    if (!notice) return res.status(404).json({ message: 'Exam notice not found' })

    await deleteFromDrive(notice.pdf.fileId)
    await ExamNotice.findByIdAndDelete(req.params.id)
    res.json({ message: 'Exam notice deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { createExamNotice, getAllExamNotices, getExamNoticeById, updateExamNotice, deleteExamNotice }
