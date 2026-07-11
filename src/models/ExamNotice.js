const mongoose = require('mongoose')

const examNoticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    examDateFrom: { type: Date, required: true },
    examDateTo: { type: Date, required: true },
    description: { type: String, trim: true },
    pdf: {
      fileId: String,
      fileName: String,
      viewLink: String,
      directLink: String,
    },
    image: {
      fileId: String,
      viewLink: String,
      directLink: String,
    },
  },
  { timestamps: true, collection: 'exam_notices' }
)

module.exports = mongoose.model('ExamNotice', examNoticeSchema)
