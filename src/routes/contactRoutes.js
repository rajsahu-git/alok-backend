const express = require('express')
const { protect, isAdmin } = require('../middleware/authMiddleware')
const { createContact, getAllContacts, getContactById } = require('../controllers/contactController')

const router = express.Router()

router.post('/', createContact)
router.get('/',  getAllContacts)
router.get('/:id', getContactById)

module.exports = router
