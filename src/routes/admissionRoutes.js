const express = require('express')
const { createAdmission, getAllAdmissions, getAdmissionById } = require('../controllers/admissionController')

const router = express.Router()

router.post('/', createAdmission)
router.get('/', getAllAdmissions)
router.get('/:id', getAdmissionById)

module.exports = router
