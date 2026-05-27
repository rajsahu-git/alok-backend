const express = require('express')
const { protect, isAdmin } = require('../middleware/authMiddleware')
const { createUser, getAllUsers, getUserById, updateUser, deleteUser, grantAdminRole } = require('../controllers/userAcessController')

const router = express.Router()

// All routes require login + admin role
// router.use(protect, isAdmin)

router.post('/', createUser)
router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
router.patch('/:id/grant-admin', grantAdminRole)

module.exports = router
