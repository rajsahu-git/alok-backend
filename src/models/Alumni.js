const mongoose = require('mongoose')

const alumniSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: {
      fileId: { type: String, required: true },
      viewLink: { type: String, required: true },
        directLink: { type: String, required: true },
    },
    batch: { type: String, required: false },
    currentPosition: { type: String, required: true },
    linkedin: { type: String },
    github: { type: String },
    twitter: { type: String },
  },
  { timestamps: true, collection: 'alumni' }
)

module.exports = mongoose.model('Alumni', alumniSchema)