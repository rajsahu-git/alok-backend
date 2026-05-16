const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  avatar: { type: String },
  role: { type: String, enum: ['admin', 'teacher', 'student', 'parent'], default: 'student' },
  address: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
