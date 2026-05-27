 const User = require('../models/User')

// POST /api/users
const createUser = async (req, res) => {
  try {
    const { name, email, phone, role, address } = req.body
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email and phone are required' })
    }
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ message: 'Email already exists' })

    const user = await User.create({ name, email, phone, role, address })
    res.status(201).json({ message: 'User created', user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json({ count: users.length, users })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ message: 'User updated', user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const isSuperAdmin = (req, res, next) => {
  
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Forbidden: Superadmin access required' })
  }
  next()
}


module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser }
