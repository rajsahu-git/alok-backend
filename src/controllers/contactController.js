const Contact = require('../models/Contact')

const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message)
      return res.status(400).json({ message: 'Name, email and message are required' })

    const contact = await Contact.create({ name, email, message })
    res.status(201).json({ message: 'Message sent successfully', contact })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json({ count: contacts.length, contacts })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
    if (!contact) return res.status(404).json({ message: 'Message not found' })
    res.json(contact)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { createContact, getAllContacts, getContactById }
