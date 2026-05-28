const express = require('express')
const router = express.Router()
const upload = require('../upload/multer')
const { createArticle, getArticles, getArticleById, updateArticle, deleteArticle } = require('../controllers/articleController')

router.post('/', upload.single('thumbnail'), createArticle)
router.get('/', getArticles)
router.get('/:slug', getArticleById)
router.put('/:id', upload.single('thumbnail'), updateArticle)
router.delete('/:id', deleteArticle)

module.exports = router
