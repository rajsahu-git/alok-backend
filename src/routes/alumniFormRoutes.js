const express = require('express')
const upload = require('../upload/multer')
const { submitAlumniForm, getAllAlumniForms, getAlumniFormById, updateAlumniForm, deleteAlumniForm } = require('../controllers/alumniFormController')

const router = express.Router()

router.post('/', upload.single('image'), submitAlumniForm)
router.get('/', getAllAlumniForms)
router.get('/:id', getAlumniFormById)
router.put('/:id', upload.single('image'), updateAlumniForm)
router.delete('/:id', deleteAlumniForm)

module.exports = router
