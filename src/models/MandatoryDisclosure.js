const mongoose = require('mongoose')

const mandatoryDisclosureSchema = new mongoose.Schema(
  {
    title: { type: String, required: false, trim: true },
    file: {
      fileId: { type: String, required: true },
      fileName: { type: String, required: true },
      viewLink: { type: String, required: true },
      directLink: { type: String, required: true },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'mandatory_disclosures' }
)

module.exports = mongoose.model('MandatoryDisclosure', mandatoryDisclosureSchema)
