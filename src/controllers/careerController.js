const Career = require('../models/Career')
const { uploadToDrive, deleteFromDrive } = require('../upload/googleDrive')

// POST /api/career
const createCareerApplication = async (req, res) => {
  try {
    const body = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body

    const { position, personalInformation, declaration } = body
    if (!position?.trim()) return res.status(400).json({ message: 'position is required' })
    if (!personalInformation?.firstName?.trim() || !personalInformation?.email?.trim() || !personalInformation?.mobileNumber?.trim() || !personalInformation?.dateOfBirth || !personalInformation?.gender)
      return res.status(400).json({ message: 'firstName, email, mobileNumber, dateOfBirth and gender are required in personalInformation' })

    const documents = {}

    if (req.files?.resume?.[0]) {
      const uploaded = await uploadToDrive(req.files.resume[0],"1uO1ItKUsVBH_Qtwu8D7ra9oJHAm6LYQL")
      documents.resume = { fileId: uploaded.fileId, fileName: uploaded.fileName, viewLink: uploaded.viewLink, directLink: uploaded.directLink }
    }

    if (req.files?.passportPhoto?.[0]) {
      const uploaded = await uploadToDrive(req.files.passportPhoto[0], "1uO1ItKUsVBH_Qtwu8D7ra9oJHAm6LYQL")
      documents.passportPhoto = { fileId: uploaded.fileId, fileName: uploaded.fileName, viewLink: uploaded.viewLink, directLink: uploaded.directLink }
    }

    const application = await Career.create({
      ...body,
      personalInformation: {
        ...body.personalInformation,
        dateOfBirth: new Date(body.personalInformation.dateOfBirth),
      },
      documents,
      declaration: {
        agreed: declaration?.agreed || false,
        submittedAt: declaration?.agreed ? new Date() : null,
      },
    })

    res.status(201).json({ message: 'Career application submitted successfully', application })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/career
const getAllApplications = async (req, res) => {
  try {
    const { status, position } = req.query
    const filter = {}
    if (status) filter.applicationStatus = status
    if (position) filter.position = new RegExp(position, 'i')

    const applications = await Career.find(filter)
      .select('-documents')
      .sort({ createdAt: -1 })
    res.json({ count: applications.length, applications })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/career/:id
const getApplicationById = async (req, res) => {
  try {
    const application = await Career.findById(req.params.id)
    if (!application) return res.status(404).json({ message: 'Application not found' })
    res.json(application)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PATCH /api/career/:id/status  — admin updates status only
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationStatus } = req.body
    if (!applicationStatus) return res.status(400).json({ message: 'applicationStatus is required' })

    const application = await Career.findByIdAndUpdate(
      req.params.id,
      { applicationStatus },
      { new: true }
    )
    if (!application) return res.status(404).json({ message: 'Application not found' })
    res.json({ message: 'Status updated successfully', application })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/career/:id
const deleteApplication = async (req, res) => {
  try {
    const application = await Career.findById(req.params.id)
    if (!application) return res.status(404).json({ message: 'Application not found' })

    if (application.documents?.resume?.fileId) await deleteFromDrive(application.documents.resume.fileId)
    if (application.documents?.passportPhoto?.fileId) await deleteFromDrive(application.documents.passportPhoto.fileId)

    await Career.findByIdAndDelete(req.params.id)
    res.json({ message: 'Application deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { createCareerApplication, getAllApplications, getApplicationById, updateApplicationStatus, deleteApplication }
