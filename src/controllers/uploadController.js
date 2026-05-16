const { createFolder, listFolders, listFilesInFolder, uploadToDrive, deleteFromDrive } = require('../upload/googleDrive')
const BannerImage = require('../models/BannerImage')

// POST /api/upload/folder
const createDriveFolder = async (req, res) => {
  try {
    const { folderName, parentFolderId } = req.body
    if (!folderName) return res.status(400).json({ message: 'folderName is required' })
    const folder = await createFolder(folderName, parentFolderId)
    res.status(201).json({ message: 'Folder created', folder })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/upload/folders
const getDriveFolders = async (req, res) => {
  try {
    const { parentFolderId } = req.query
    const folders = await listFolders(parentFolderId)
    res.json({ count: folders.length, folders })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/upload/folder/:folderId/files
const getFilesInFolder = async (req, res) => {
  try {
    const files = await listFilesInFolder(req.params.folderId)
    res.json({ count: files.length, files })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/upload/single
const uploadSingle = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' })
    const result = await uploadToDrive(req.file, req.body.folderId)
  const banner = await BannerImage.create({ ...result, uploadedBy: req.body.userId })
    res.status(201).json({ message: 'File uploaded successfully', file: result, banner })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/upload/multiple
const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: 'No files provided' })
    const results = await Promise.all(req.files.map((file) => uploadToDrive(file, req.body.folderId)))
    const banners = await Promise.all(results.map((result) => BannerImage.create({ ...result, uploadedBy: req.body.userId })))
    res.status(201).json({ message: 'Files uploaded successfully', count: results.length, files: results, banners })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/upload/:fileId
const deleteFile = async (req, res) => {
  try {
    await deleteFromDrive(req.params.fileId)
    res.json({ message: 'File deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/upload/banner — admin only
const uploadBanner = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' })
    const result = await uploadToDrive(req.file, req.body.folderId)
    const banner = await BannerImage.create({ ...result, uploadedBy: req.user.id })
    res.status(201).json({ message: 'Banner uploaded successfully', banner })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/upload/banners — get all banners
const getAllBanners = async (req, res) => {
  try {
    const banners = await BannerImage.find().populate('uploadedBy', 'name email').sort({ createdAt: -1 })
    res.json({ count: banners.length, banners })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/upload/banner/:id — get single banner
const getBannerById = async (req, res) => {
  try {
    const banner = await BannerImage.findById(req.params.id).populate('uploadedBy', 'name email')
    if (!banner) return res.status(404).json({ message: 'Banner not found' })
    res.json(banner)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/upload/banner/:id — delete from DB and Drive
const deleteBanner = async (req, res) => {
  try {
    const banner = await BannerImage.findById(req.params.id)
    if (!banner) return res.status(404).json({ message: 'Banner not found' })
    await deleteFromDrive(banner.fileId)
    await BannerImage.findByIdAndDelete(req.params.id)
    res.json({ message: 'Banner deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  createDriveFolder, getDriveFolders, getFilesInFolder,
  uploadSingle, uploadMultiple, deleteFile,
  uploadBanner, getAllBanners, getBannerById, deleteBanner,
}
