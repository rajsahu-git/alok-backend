const mongoose = require('mongoose')

const admissionSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    classSeekingAdmission: { type: String, required: true, trim: true },
    parentName: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    previousSchool: { type: String, trim: true },
    message: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' },
  },
  { timestamps: true, collection: 'admissions' }
)

module.exports = mongoose.model('Admission', admissionSchema)