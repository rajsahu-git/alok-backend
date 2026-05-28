const Article = require('../models/Article')
const { uploadToDrive, deleteFromDrive } = require('../upload/googleDrive')

const toSlug = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')

// POST /api/articles
const createArticle = async (req, res) => {
  try {
    const { title, content, } = req.body
    if (!title?.trim() || !content?.trim())
      return res.status(400).json({ message: 'title and content are required' })
   
    const slug = toSlug(title) + '-' + Math.random().toString(36).substr(2, 6) // Ensure uniqueness
    const articleData = {
      title: title.trim(),
      slug,
      content: content.trim(),
     
    }

    if (req.file) {
      const uploaded = await uploadToDrive(req.file, "1BMyAS3-6kAT2QiAHRkB6EoaBTD4C54a-")
      articleData.thumbnail = { fileId: uploaded.fileId, viewLink: uploaded.viewLink, directLink: uploaded.directLink }
    }

    const article = await Article.create(articleData)
    res.status(201).json({ message: 'Article created successfully', article })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/articles
const getArticles = async (req, res) => {
  try {
    const filter = {}
    if (req.query.published !== undefined) filter.published = req.query.published === 'true'
    if (req.query.category) filter.category = req.query.category
    const articles = await Article.find(filter).sort({ createdAt: -1 })
    res.json({ count: articles.length, articles })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/articles/:slug
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug })
    if (!article) return res.status(404).json({ message: 'Article not found' })
    res.json(article)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/articles/:id
const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
    if (!article) return res.status(404).json({ message: 'Article not found' })

    const { title, content,  } = req.body
    const updateData = {}

    if (title?.trim()) updateData.title = title.trim()
    if (content?.trim()) updateData.content = content.trim()
    

    if (req.file) {
      if (article.thumbnail?.fileId) await deleteFromDrive(article.thumbnail.fileId)
      const uploaded = await uploadToDrive(req.file, "1BMyAS3-6kAT2QiAHRkB6EoaBTD4C54a-")
      updateData.thumbnail = { fileId: uploaded.fileId, viewLink: uploaded.viewLink, directLink: uploaded.directLink }
    }

    const updated = await Article.findByIdAndUpdate(req.params.id, updateData, { new: true })
    res.json({ message: 'Article updated successfully', article: updated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/articles/:id
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
    if (!article) return res.status(404).json({ message: 'Article not found' })
    if (article.thumbnail?.fileId) await deleteFromDrive(article.thumbnail.fileId)
    await Article.findByIdAndDelete(req.params.id)
    res.json({ message: 'Article deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { createArticle, getArticles, getArticleById, updateArticle, deleteArticle }
