const mongoose = require('mongoose')

const transferCertificateSchema = new mongoose.Schema(
  {
    scholarNumber: { type: String, required: true, trim: true, unique: true },
    name: { type: String, required: true, trim: true },
    fatherName: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    lastClass: { type: String, required: true, trim: true },
    tcFile: {
      fileId: { type: String, required: true },
      fileName: { type: String, required: true },
      viewLink: { type: String, required: true },
      directLink: { type: String, required: true },
    },
  },
  { timestamps: true, collection: 'transfer_certificates' }
)

module.exports = mongoose.model('TransferCertificate', transferCertificateSchema)
