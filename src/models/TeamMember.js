const mongoose = require('mongoose')

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true }, // e.g. "Teaching", "Management", "Support"
    designation: { type: String, required: true, trim: true },
    education: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true }, // e.g. "5 years"
    bio: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    image: {
      fileId: { type: String, required: true },
      viewLink: { type: String, required: true },
      directLink: { type: String, required: true },
    },
    order: { type: Number, default: 0 }, // for controlling display order
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'our_team' }
)

module.exports = mongoose.model('TeamMember', teamMemberSchema)
