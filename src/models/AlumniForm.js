const mongoose = require('mongoose')

const alumniFormSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    dob: { type: Date, required: true },
    mobileNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    yearOfPassing: { type: String, required: true, trim: true },
    classStream: { type: String, required: true, trim: true },
    admissionNumber: { type: String, trim: true },
    currentProfession: { type: String, required: true, trim: true },
    cityCountry: { type: String, required: true, trim: true },
    interestedInMentoring: { type: Boolean, default: false },
    receiveAlumniUpdates: { type: Boolean, default: false },
    message: { type: String, trim: true },
    image: {
      fileId: { type: String },
      viewLink: { type: String },
      directLink: { type: String },
    },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true, collection: 'alumni_forms' }
)

module.exports = mongoose.model('AlumniForm', alumniFormSchema)
