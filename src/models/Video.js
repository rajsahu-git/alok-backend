const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema(
  {
    videoLink: { type: String, required: true },
    title: { type: String, required: true },
  },
  { timestamps: true, collection: 'gallery_videos' }
)

module.exports = mongoose.model('GalleryVideo', videoSchema)