const express = require('express')
const upload = require('../upload/multer')

const {createAlumni, getAlumni, deleteAlumni, updateAlumni} = require('../controllers/alumniController')

const router = express.Router()


router.post('/', upload.single('image'), createAlumni)
router.get('/', getAlumni)
router.put('/:id', upload.single('image'), updateAlumni)
router.delete('/:id', deleteAlumni)


module.exports = router
