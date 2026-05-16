const mongoose = require('mongoose')

const galleryImageSchema = new mongoose.Schema(
  {
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'GalleryFolder', required: true },
    fileId: { type: String, required: true },
    fileName: { type: String, required: true },
    viewLink: { type: String, required: true },
    directLink: { type: String, required: true },
  },
  { timestamps: true, collection: 'gallery_images' }
)

module.exports = mongoose.model('GalleryImage', galleryImageSchema)
