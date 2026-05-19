const express = require('express')
const upload = require('../upload/multer')
const { createTeamMember, getAllTeamMembers, getTeamMembersByCategory, getTeamMemberById, updateTeamMember, deleteTeamMember } = require('../controllers/teamController')

const router = express.Router()

router.post('/', upload.single('image'), createTeamMember)
router.get('/', getAllTeamMembers)
router.get('/category/:category', getTeamMembersByCategory)
router.get('/:id', getTeamMemberById)
router.put('/:id', upload.single('image'), updateTeamMember)
router.delete('/:id', deleteTeamMember)
module.exports = router
