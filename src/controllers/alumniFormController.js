const AlumniForm = require('../models/AlumniForm')
const { uploadToDrive, deleteFromDrive } = require('../upload/googleDrive')

// POST /api/alumni-form
const submitAlumniForm = async (req, res) => {
  try {
    const {
      fullName, gender, dob, mobileNumber, email,
      yearOfPassing, classStream, admissionNumber,
      currentProfession, cityCountry,
      interestedInMentoring, receiveAlumniUpdates, message,
    } = req.body

    if (!fullName?.trim() || !gender || !dob || !mobileNumber?.trim() || !email?.trim() ||
      !yearOfPassing?.trim() || !classStream?.trim() || !currentProfession?.trim() || !cityCountry?.trim())
      return res.status(400).json({ message: 'All required fields must be filled' })

    let image = undefined
    if (req.file) {
      const uploaded = await uploadToDrive(req.file, '1pP1LTgVPHqaY-9O9jRHzh03FoHuwT9Xt')
      image = {
        fileId: uploaded.fileId,
        viewLink: uploaded.viewLink,
        directLink: uploaded.directLink,
      }
    }

    const form = await AlumniForm.create({
      fullName: fullName.trim(),
      gender,
      dob: new Date(dob),
      mobileNumber: mobileNumber.trim(),
      email: email.trim(),
      yearOfPassing: yearOfPassing.trim(),
      classStream: classStream.trim(),
      admissionNumber: admissionNumber?.trim(),
      currentProfession: currentProfession.trim(),
      cityCountry: cityCountry.trim(),
      interestedInMentoring: interestedInMentoring === 'true' || interestedInMentoring === true,
      receiveAlumniUpdates: receiveAlumniUpdates === 'true' || receiveAlumniUpdates === true,
      message: message?.trim(),
      image,
    })

    res.status(201).json({ message: 'Alumni form submitted successfully', form })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/alumni-form
const getAllAlumniForms = async (req, res) => {
  try {
    const { status } = req.query
    const filter = {}
    if (status) filter.status = status

    const forms = await AlumniForm.find(filter).sort({ createdAt: -1 })
    res.json({ count: forms.length, forms })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/alumni-form/:id
const getAlumniFormById = async (req, res) => {
  try {
    const form = await AlumniForm.findById(req.params.id)
    if (!form) return res.status(404).json({ message: 'Alumni form not found' })
    res.json(form)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/alumni-form/:id
const updateAlumniForm = async (req, res) => {
  try {
    const form = await AlumniForm.findById(req.params.id)
    if (!form) return res.status(404).json({ message: 'Alumni form not found' })

    const {
      fullName, gender, dob, mobileNumber, email,
      yearOfPassing, classStream, admissionNumber,
      currentProfession, cityCountry,
      interestedInMentoring, receiveAlumniUpdates, message, status,
    } = req.body

    const updateData = {}
    if (fullName?.trim()) updateData.fullName = fullName.trim()
    if (gender) updateData.gender = gender
    if (dob) updateData.dob = new Date(dob)
    if (mobileNumber?.trim()) updateData.mobileNumber = mobileNumber.trim()
    if (email?.trim()) updateData.email = email.trim()
    if (yearOfPassing?.trim()) updateData.yearOfPassing = yearOfPassing.trim()
    if (classStream?.trim()) updateData.classStream = classStream.trim()
    if (admissionNumber?.trim()) updateData.admissionNumber = admissionNumber.trim()
    if (currentProfession?.trim()) updateData.currentProfession = currentProfession.trim()
    if (cityCountry?.trim()) updateData.cityCountry = cityCountry.trim()
    if (interestedInMentoring !== undefined) updateData.interestedInMentoring = interestedInMentoring === 'true' || interestedInMentoring === true
    if (receiveAlumniUpdates !== undefined) updateData.receiveAlumniUpdates = receiveAlumniUpdates === 'true' || receiveAlumniUpdates === true
    if (message?.trim()) updateData.message = message.trim()
    if (status) updateData.status = status

    if (req.file) {
      if (form.image?.fileId) await deleteFromDrive(form.image.fileId)
      const uploaded = await uploadToDrive(req.file, '1pP1LTgVPHqaY-9O9jRHzh03FoHuwT9Xt')
      updateData.image = {
        fileId: uploaded.fileId,
        viewLink: uploaded.viewLink,
        directLink: uploaded.directLink,
      }
    }

    const updated = await AlumniForm.findByIdAndUpdate(req.params.id, updateData, { new: true })
    res.json({ message: 'Alumni form updated successfully', form: updated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/alumni-form/:id
const deleteAlumniForm = async (req, res) => {
  try {
    const form = await AlumniForm.findById(req.params.id)
    if (!form) return res.status(404).json({ message: 'Alumni form not found' })

    if (form.image?.fileId) await deleteFromDrive(form.image.fileId)
    await AlumniForm.findByIdAndDelete(req.params.id)
    res.json({ message: 'Alumni form deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { submitAlumniForm, getAllAlumniForms, getAlumniFormById, updateAlumniForm, deleteAlumniForm }
