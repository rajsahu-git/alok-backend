const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    thumbnail: {
      fileId: { type: String, required: true },
      viewLink: { type: String, required: true },
      directLink: { type: String, required: true },
    },
    blog: { type: String, required: true },
  },
  { timestamps: true, collection: 'blogs' }
)

module.exports = mongoose.model('Blog', blogSchema)
