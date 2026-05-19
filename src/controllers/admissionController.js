const Admission = require('../models/Admission')

// POST /api/admission
const createAdmission = async (req, res) => {
  try {
    const {
      studentName, classSeekingAdmission, parentName, contactNumber,
      email, address, city, state, pincode, dateOfBirth, gender,
      previousSchool, message,
    } = req.body

    if (!studentName?.trim() || !classSeekingAdmission?.trim() || !parentName?.trim() ||
      !contactNumber?.trim() || !email?.trim() || !address?.trim() || !city?.trim() ||
      !state?.trim() || !pincode?.trim() || !dateOfBirth || !gender)
      return res.status(400).json({ message: 'All required fields must be filled' })

    const admission = await Admission.create({
      studentName: studentName.trim(),
      classSeekingAdmission: classSeekingAdmission.trim(),
      parentName: parentName.trim(),
      contactNumber: contactNumber.trim(),
      email: email.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      dateOfBirth: new Date(dateOfBirth),
      gender,
      previousSchool: previousSchool?.trim(),
      message: message?.trim(),
    })

    res.status(201).json({ message: 'Admission form submitted successfully', admission })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/admission
const getAllAdmissions = async (req, res) => {
  try {
    const { status } = req.query
    const filter = {}
    if (status) filter.status = status

    const admissions = await Admission.find(filter).sort({ createdAt: -1 })
    res.json({ count: admissions.length, admissions })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/admission/:id
const getAdmissionById = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id)
    if (!admission) return res.status(404).json({ message: 'Admission not found' })
    res.json(admission)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { createAdmission, getAllAdmissions, getAdmissionById }
