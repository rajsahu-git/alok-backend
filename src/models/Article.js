const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
  title:     { type: String, required: true, trim: true },
  slug:      { type: String, required: true, trim: true, unique: true },
  content:   { type: String, required: true },
  thumbnail: {
    fileId:     { type: String },
    viewLink:   { type: String },
    directLink: { type: String },
  },
}, { timestamps: true, collection: 'articles' })

module.exports = mongoose.model('Article', articleSchema)
