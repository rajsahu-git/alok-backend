const mongoose = require('mongoose')

const popupSchema = new mongoose.Schema(
  {
    image: {
      fileId: { type: String, required: true },
      viewLink: { type: String, required: true },
      directLink: { type: String, required: true },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'popups' }
)

module.exports = mongoose.model('Popup', popupSchema)
