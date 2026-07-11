const express = require('express')
const uploadExamNoticeFiles = require('../upload/multerExamNotice')
const { createExamNotice, getAllExamNotices, getExamNoticeById, updateExamNotice, deleteExamNotice } = require('../controllers/examNoticeController')

const router = express.Router()

router.post('/', uploadExamNoticeFiles, createExamNotice)
router.get('/', getAllExamNotices)
router.get('/:id', getExamNoticeById)
router.put('/:id', uploadExamNoticeFiles, updateExamNotice)
router.delete('/:id', deleteExamNotice)

module.exports = router
