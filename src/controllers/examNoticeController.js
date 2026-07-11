const ExamNotice = require('../models/ExamNotice')
const { uploadToDrive, deleteFromDrive } = require('../upload/googleDrive')

const EXAM_NOTICE_FOLDER_ID = '1YxWtKYEpwPUCxwd9d7GbkAtxxHQdnaBV'

// POST /api/exam-notice
const createExamNotice = async (req, res) => {
  try {
    const { title, examDateFrom, examDateTo, description } = req.body
    if (!title?.trim() || !examDateFrom || !examDateTo )
      return res.status(400).json({ message: 'title, examDateFrom, examDateTo and description are required' })

    const pdfFile = req.files?.pdf?.[0]
    const imageFile = req.files?.image?.[0]

    if (pdfFile && imageFile)
      return res.status(400).json({ message: 'Upload either a PDF or an image, not both' })
    if (!pdfFile && !imageFile)
      return res.status(400).json({ message: 'A PDF or image attachment is required' })

    const noticeData = {
      title: title.trim(),
      examDateFrom: new Date(examDateFrom),
      examDateTo: new Date(examDateTo),
      description: description?.trim(),
    }

    if (pdfFile) {
      const uploaded = await uploadToDrive(pdfFile, EXAM_NOTICE_FOLDER_ID)
      noticeData.pdf = {
        fileId: uploaded.fileId,
        fileName: uploaded.fileName,
        viewLink: uploaded.viewLink,
        directLink: uploaded.directLink,
      }
    } else {
      const uploaded = await uploadToDrive(imageFile, EXAM_NOTICE_FOLDER_ID)
      noticeData.image = {
        fileId: uploaded.fileId,
        viewLink: uploaded.viewLink,
        directLink: uploaded.directLink,
      }
    }

    const notice = await ExamNotice.create(noticeData)

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

    const pdfFile = req.files?.pdf?.[0]
    const imageFile = req.files?.image?.[0]
    if (pdfFile && imageFile)
      return res.status(400).json({ message: 'Upload either a PDF or an image, not both' })

    const { title, examDateFrom, examDateTo, description } = req.body
    const setFields = {}
    const unsetFields = {}

    if (title?.trim()) setFields.title = title.trim()
    if (examDateFrom) setFields.examDateFrom = new Date(examDateFrom)
    if (examDateTo) setFields.examDateTo = new Date(examDateTo)
    if (description?.trim()) setFields.description = description.trim()

    if (pdfFile) {
      if (notice.pdf?.fileId) await deleteFromDrive(notice.pdf.fileId)
      if (notice.image?.fileId) await deleteFromDrive(notice.image.fileId)
      const uploaded = await uploadToDrive(pdfFile, EXAM_NOTICE_FOLDER_ID)
      setFields.pdf = {
        fileId: uploaded.fileId,
        fileName: uploaded.fileName,
        viewLink: uploaded.viewLink,
        directLink: uploaded.directLink,
      }
      unsetFields.image = 1
    } else if (imageFile) {
      if (notice.pdf?.fileId) await deleteFromDrive(notice.pdf.fileId)
      if (notice.image?.fileId) await deleteFromDrive(notice.image.fileId)
      const uploaded = await uploadToDrive(imageFile, EXAM_NOTICE_FOLDER_ID)
      setFields.image = {
        fileId: uploaded.fileId,
        viewLink: uploaded.viewLink,
        directLink: uploaded.directLink,
      }
      unsetFields.pdf = 1
    }

    const updateQuery = { $set: setFields }
    if (Object.keys(unsetFields).length) updateQuery.$unset = unsetFields

    const updated = await ExamNotice.findByIdAndUpdate(req.params.id, updateQuery, { new: true })
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

    if (notice.pdf?.fileId) await deleteFromDrive(notice.pdf.fileId)
    if (notice.image?.fileId) await deleteFromDrive(notice.image.fileId)
    await ExamNotice.findByIdAndDelete(req.params.id)
    res.json({ message: 'Exam notice deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { createExamNotice, getAllExamNotices, getExamNoticeById, updateExamNotice, deleteExamNotice }
