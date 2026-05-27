const mongoose = require('mongoose')

const galleryFolderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    driveId: { type: String, required: true },
    viewLink: { type: String, required: true },
    order: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, collection: 'gallery_folders' }
)

module.exports = mongoose.model('GalleryFolder', galleryFolderSchema)
