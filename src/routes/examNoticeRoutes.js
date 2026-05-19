const express = require('express')
const uploadPdf = require('../upload/multerPdf')
const { createExamNotice, getAllExamNotices, getExamNoticeById, updateExamNotice, deleteExamNotice } = require('../controllers/examNoticeController')

const router = express.Router()

router.post('/', uploadPdf.single('pdf'), createExamNotice)
router.get('/', getAllExamNotices)
router.get('/:id', getExamNoticeById)
router.put('/:id', uploadPdf.single('pdf'), updateExamNotice)
router.delete('/:id', deleteExamNotice)

module.exports = router
