const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    studentClass: { type: String, required: true, trim: true },
    stream: { type: String, trim: true, default: null },
    sessionYear: { type: String, required: true, trim: true },
    percentage: { type: Number, required: true },
    image: {
      fileId: { type: String, required: true },
      viewLink: { type: String, required: true },
      directLink: { type: String, required: true },
    },
  },
  { timestamps: true, collection: 'results' }
)

module.exports = mongoose.model('Result', resultSchema)
