const mongoose = require('mongoose')

const questionBankSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    class: { type: String, required: true, trim: true },
    pdf: {
      fileId: { type: String },
      fileName: { type: String },
      viewLink: { type: String },
      directLink: { type: String },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'question_banks' }
)

module.exports = mongoose.model('QuestionBank', questionBankSchema)