const Blog = require('../models/Blog')
const { uploadToDrive, deleteFromDrive } = require('../upload/googleDrive')

// POST /api/blog
const createBlog = async (req, res) => {
  try {
    const { title, blog } = req.body
    if (!title?.trim() || !blog?.trim()) return res.status(400).json({ message: 'title and blog are required' })
    if (!req.file) return res.status(400).json({ message: 'thumbnail is required' })

    const uploaded = await uploadToDrive(req.file)
    const newBlog = await Blog.create({
      title: title.trim(),
      blog: blog.trim(),
      thumbnail: {
        fileId: uploaded.fileId,
        viewLink: uploaded.viewLink,
        directLink: uploaded.directLink,
      },
    })

    res.status(201).json({ message: 'Blog created successfully', blog: newBlog })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/blog/:id
const updateBlog = async (req, res) => {
  try {
    const existing = await Blog.findById(req.params.id)
    if (!existing) return res.status(404).json({ message: 'Blog not found' })

    const { title, blog } = req.body
    const updateData = {}

    if (title?.trim()) updateData.title = title.trim()
    if (blog?.trim()) updateData.blog = blog.trim()

    if (req.file) {
      await deleteFromDrive(existing.thumbnail.fileId)
      const uploaded = await uploadToDrive(req.file)
      updateData.thumbnail = {
        fileId: uploaded.fileId,
        viewLink: uploaded.viewLink,
        directLink: uploaded.directLink,
      }
    }

    const updated = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true })
    res.json({ message: 'Blog updated successfully', blog: updated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/blog/:id
const deleteBlog = async (req, res) => {
  try {
    const existing = await Blog.findById(req.params.id)
    if (!existing) return res.status(404).json({ message: 'Blog not found' })

    await deleteFromDrive(existing.thumbnail.fileId)
    await Blog.findByIdAndDelete(req.params.id)
    res.json({ message: 'Blog deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/blog
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 })
    res.json({ count: blogs.length, blogs })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/blog/:id
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    res.json(blog)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { createBlog, updateBlog, deleteBlog, getAllBlogs, getBlogById }
