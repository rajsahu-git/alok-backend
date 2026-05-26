const Notice = require('../models/Notice')
const { uploadToDrive, deleteFromDrive } = require('../upload/googleDrive')

// POST /api/notice
const createNotice = async (req, res) => {
  try {
    const { title, description, link } = req.body
    if (!title?.trim()) return res.status(400).json({ message: 'title is required' })

    const noticeData = {
      title: title.trim(),
      description: description?.trim(),
      link: link?.trim(),
    }

    if (req.files?.image?.[0]) {
      const uploaded = await uploadToDrive(req.files.image[0])
      noticeData.image = { fileId: uploaded.fileId, viewLink: uploaded.viewLink, directLink: uploaded.directLink }
    }

    if (req.files?.pdf?.[0]) {
      const uploaded = await uploadToDrive(req.files.pdf[0])
      noticeData.pdf = { fileId: uploaded.fileId, fileName: uploaded.fileName, viewLink: uploaded.viewLink, directLink: uploaded.directLink }
    }

    const notice = await Notice.create(noticeData)
    res.status(201).json({ message: 'Notice created successfully', notice })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/notice
const getAllNotices = async (req, res) => {
  try {
    const { isActive } = req.query
    const filter = {}
    if (isActive !== undefined) filter.isActive = isActive === 'true'

    const notices = await Notice.find(filter).sort({ createdAt: -1 })
    res.json({ count: notices.length, notices })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/notice/:id
const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
    if (!notice) return res.status(404).json({ message: 'Notice not found' })
    res.json(notice)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/notice/:id
const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
    if (!notice) return res.status(404).json({ message: 'Notice not found' })

    const { title, description, link, isActive } = req.body
    const updateData = {}

    if (title?.trim()) updateData.title = title.trim()
    if (description?.trim()) updateData.description = description.trim()
    if (link?.trim()) updateData.link = link.trim()
    if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true

    if (req.files?.image?.[0]) {
      if (notice.image?.fileId) await deleteFromDrive(notice.image.fileId)
      const uploaded = await uploadToDrive(req.files.image[0])
      updateData.image = { fileId: uploaded.fileId, viewLink: uploaded.viewLink, directLink: uploaded.directLink }
    }

    if (req.files?.pdf?.[0]) {
      if (notice.pdf?.fileId) await deleteFromDrive(notice.pdf.fileId)
      const uploaded = await uploadToDrive(req.files.pdf[0])
      updateData.pdf = { fileId: uploaded.fileId, fileName: uploaded.fileName, viewLink: uploaded.viewLink, directLink: uploaded.directLink }
    }

    const updated = await Notice.findByIdAndUpdate(req.params.id, updateData, { new: true })
    res.json({ message: 'Notice updated successfully', notice: updated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/notice/:id
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
    if (!notice) return res.status(404).json({ message: 'Notice not found' })

    if (notice.image?.fileId) await deleteFromDrive(notice.image.fileId)
    if (notice.pdf?.fileId) await deleteFromDrive(notice.pdf.fileId)
    await Notice.findByIdAndDelete(req.params.id)
    res.json({ message: 'Notice deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { createNotice, getAllNotices, getNoticeById, updateNotice, deleteNotice }
