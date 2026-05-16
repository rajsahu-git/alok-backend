const mongoose = require('mongoose')

const bannerImageSchema = new mongoose.Schema({
  fileId: { type: String, required: true },
  fileName: { type: String, required: true },
  viewLink: { type: String, required: true },
  directLink: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true, collection: 'banner_images' })

module.exports = mongoose.model('BannerImage', bannerImageSchema)
