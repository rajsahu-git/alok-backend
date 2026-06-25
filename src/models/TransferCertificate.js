const mongoose = require('mongoose')

const transferCertificateSchema = new mongoose.Schema(
  {
    scholarNumber: { type: String, required: true, trim: true, unique: true },
    name: { type: String, required: false, trim: true },
    fatherName: { type: String, required: false, trim: true },
    dob: { type: String, required: false },
    lastClass: { type: String, required: false, trim: true },
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
