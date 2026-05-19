const mongoose = require('mongoose')

const examNoticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    examDateFrom: { type: Date, required: true },
    examDateTo: { type: Date, required: true },
    description: { type: String, required: true, trim: true },
    pdf: {
      fileId: { type: String, required: true },
      fileName: { type: String, required: true },
      viewLink: { type: String, required: true },
      directLink: { type: String, required: true },
    },
  },
  { timestamps: true, collection: 'exam_notices' }
)

module.exports = mongoose.model('ExamNotice', examNoticeSchema)
