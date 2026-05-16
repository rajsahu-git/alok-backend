const express = require('express')
const upload = require('../upload/multer')
const { createBlog, updateBlog, deleteBlog, getAllBlogs, getBlogById } = require('../controllers/blogController')

const router = express.Router()

router.post('/', upload.single('thumbnail'), createBlog)
router.put('/:id', upload.single('thumbnail'), updateBlog)
router.delete('/:id', deleteBlog)
router.get('/', getAllBlogs)
router.get('/:id', getBlogById)

module.exports = router
