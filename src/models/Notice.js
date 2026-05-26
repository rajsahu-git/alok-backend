const mongoose = require('mongoose')

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    link: { type: String, trim: true },
    image: {
      fileId: { type: String },
      viewLink: { type: String },
      directLink: { type: String },
    },
    pdf: {
      fileId: { type: String },
      fileName: { type: String },
      viewLink: { type: String },
      directLink: { type: String },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'notices' }
)

module.exports = mongoose.model('Notice', noticeSchema)
