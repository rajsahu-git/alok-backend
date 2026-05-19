const mongoose = require('mongoose')

const achievementSchema = new mongoose.Schema(
  {
    image: {
      fileId: { type: String, required: true },
      viewLink: { type: String, required: true },
      directLink: { type: String, required: true },
    },
  },
  { timestamps: true, collection: 'achievements' }
)

module.exports = mongoose.model('Achievement', achievementSchema)
