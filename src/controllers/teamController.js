const TeamMember = require('../models/TeamMember')
const { uploadToDrive, deleteFromDrive } = require('../upload/googleDrive')

// POST /api/team
const createTeamMember = async (req, res) => {
  try {
    const { name, category, designation, education, experience, bio, email, phone, order } = req.body
    if (!name?.trim() || !category?.trim() || !designation?.trim() || !education?.trim() || !experience?.trim())
      return res.status(400).json({ message: 'name, category, designation, education and experience are required' })
    if (!req.file) return res.status(400).json({ message: 'image is required' })

    const uploaded = await uploadToDrive(req.file,'12_G9vZxZ89qqZjxmoGihVFl8J7gfvh6l')
    const member = await TeamMember.create({
      name: name.trim(),
      category: category.trim(),
      designation: designation.trim(),
      education: education.trim(),
      experience: experience.trim(),
      bio: bio?.trim(),
      email: email?.trim(),
      phone: phone?.trim(),
      order: order ? Number(order) : 0,
      image: {
        fileId: uploaded.fileId,
        viewLink: uploaded.viewLink,
        directLink: uploaded.directLink,
      },
    })

    res.status(201).json({ message: 'Team member created successfully', member })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/team
const getAllTeamMembers = async (req, res) => {
  try {
    const { category } = req.query
    const filter = { isActive: true }
    if (category) filter.category = category

    const members = await TeamMember.find(filter).sort({ order: 1, createdAt: -1 })
    res.json({ count: members.length, members })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/team/:id
const getTeamMemberById = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id)
    if (!member) return res.status(404).json({ message: 'Team member not found' })
    res.json(member)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/team/:id
const updateTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id)
    if (!member) return res.status(404).json({ message: 'Team member not found' })

    const { name, category, designation, education, experience, bio, email, phone, order, isActive } = req.body
    const updateData = {}

    if (name?.trim()) updateData.name = name.trim()
    if (category?.trim()) updateData.category = category.trim()
    if (designation?.trim()) updateData.designation = designation.trim()
    if (education?.trim()) updateData.education = education.trim()
    if (experience?.trim()) updateData.experience = experience.trim()
    if (bio?.trim()) updateData.bio = bio.trim()
    if (email?.trim()) updateData.email = email.trim()
    if (phone?.trim()) updateData.phone = phone.trim()
    if (order !== undefined) updateData.order = Number(order)
    if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true

    if (req.file) {
      await deleteFromDrive(member.image.fileId)
      const uploaded = await uploadToDrive(req.file, '12_G9vZxZ89qqZjxmoGihVFl8J7gfvh6l')
      updateData.image = {
        fileId: uploaded.fileId,
        viewLink: uploaded.viewLink,
        directLink: uploaded.directLink,
      }
    }

    const updated = await TeamMember.findByIdAndUpdate(req.params.id, updateData, { new: true })
    res.json({ message: 'Team member updated successfully', member: updated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/team/:id
const deleteTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id)
    if (!member) return res.status(404).json({ message: 'Team member not found' })

    await deleteFromDrive(member.image.fileId)
    await TeamMember.findByIdAndDelete(req.params.id)
    res.json({ message: 'Team member deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


const getTeamMembersByCategory = async (req, res) => {
  try {
    const { category } = req.params
    console.log('Fetching team members for category:', category)
    const members = await TeamMember.find({ category: category.trim(), isActive: true }).sort({ order: 1, createdAt: -1 })
    res.json({ count: members.length, members })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { createTeamMember, getAllTeamMembers, getTeamMembersByCategory, getTeamMemberById, updateTeamMember, deleteTeamMember }
