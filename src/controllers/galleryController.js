const { createFolder, listFilesInFolder, uploadToDrive, deleteFromDrive } = require('../upload/googleDrive')
const GalleryFolder = require('../models/GalleryFolder')
const GalleryImage = require('../models/GalleryImage')
const BannerImage = require('../models/BannerImage')
const GalleryVideo = require('../models/Video')
// ─── Folders ──────────────────────────────────────────────────────────────────

// POST /api/gallery/folder
const createGalleryFolder = async (req, res) => {
  try {
    const { name, userId } = req.body
    if (!name?.trim()) return res.status(400).json({ message: 'Folder name is required' })

    const driveFolder = await createFolder(name.trim())

    const folder = await GalleryFolder.create({
      name: name.trim(),
      driveId: driveFolder.folderId,
      viewLink: driveFolder.viewLink,
      createdBy: userId || null,
    })

    res.status(201).json({ message: 'Folder created successfully', folder })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/gallery/folders
const getGalleryFolders = async (req, res) => {
  try {
    const folders = await GalleryFolder.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })

    res.json({ count: folders.length, folders })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/gallery/folder/:id
const deleteGalleryFolder = async (req, res) => {
  try {
    const folder = await GalleryFolder.findById(req.params.id)
    if (!folder) return res.status(404).json({ message: 'Folder not found' })

    await GalleryFolder.findByIdAndDelete(req.params.id)
    res.json({ message: 'Folder deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ─── Images ───────────────────────────────────────────────────────────────────

// GET /api/gallery/folder/:id/images
const getImagesInFolder = async (req, res) => {
  try {
    const folder = await GalleryFolder.findById(req.params.id)
    if (!folder) return res.status(404).json({ message: 'Folder not found' })

    const images = await GalleryImage.find({ folderId: req.params.id }).sort({ createdAt: -1 })
    res.json({ count: images.length, images })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/gallery/folder/:id/images
const uploadImagesToFolder = async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ message: 'No files provided' })

    const folder = await GalleryFolder.findById(req.params.id)
    if (!folder) return res.status(404).json({ message: 'Folder not found' })

    const uploaded = await Promise.all(
      req.files.map(async (file) => {
        const driveFile = await uploadToDrive(file, folder.driveId)
        const image = await GalleryImage.create({
          folderId: req.params.id,
          fileId: driveFile.fileId,
          fileName: driveFile.fileName,
          viewLink: driveFile.viewLink,
          directLink: driveFile.directLink,
        })
        return image
      })
    )

    res.status(201).json({ message: 'Images uploaded successfully', count: uploaded.length, images: uploaded })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/gallery/image/:fileId
const deleteGalleryImage = async (req, res) => {
  try {
    const image = await GalleryImage.findOne({ fileId: req.params.fileId })
    if (!image) return res.status(404).json({ message: 'Image not found' })

    await deleteFromDrive(req.params.fileId)
    await GalleryImage.deleteOne({ fileId: req.params.fileId })
    res.json({ message: 'Image deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getBannerImages = async (req, res) => {
  try {
    const bannerImages = await BannerImage.find().sort({ createdAt: -1 })
    res.json({ count: bannerImages.length, images: bannerImages })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


const getImagesGallary = async (req, res) => {
  try {
    const folder = await GalleryFolder.findById(req.params.folder_id)
    if (!folder) return res.status(404).json({ message: 'Folder not found' })

    const images = await GalleryImage.find({ folderId: req.params.folder_id }).sort({ createdAt: -1 })
    res.json({ folder, count: images.length, images })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getFolderGallary = async (req, res) => {
  try {
    const folders = await GalleryFolder.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })

    const foldersWithCover = await Promise.all(
      folders.map(async (folder) => {
        const firstImage = await GalleryImage.findOne({ folderId: folder._id }).sort({ createdAt: 1 })
        return { ...folder.toObject(), coverImage: firstImage?.directLink || null }
      })
    )

    res.json({ count: foldersWithCover.length, folders: foldersWithCover })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


const uploadVideo = async (req, res) => {
  try {
    

    const video = await GalleryVideo.create({
      videoLink: req.body.videoLink,
      title: req.body.title,
    })
    res.status(201).json({ message: 'Video uploaded successfully', video })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


const getVideos = async (req, res) => {
  try {
    const videos = await GalleryVideo.find().sort({ createdAt: -1 })
    res.json({ count: videos.length, videos })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deleteVideo = async (req, res) => {
  try {
    const video = await GalleryVideo.findById(req.params.id)
    if (!video) return res.status(404).json({ message: 'Video not found' })
    await GalleryVideo.findByIdAndDelete(req.params.id)
    res.json({ message: 'Video deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  createGalleryFolder,
  getGalleryFolders,
  deleteGalleryFolder,
  getImagesInFolder,
  uploadImagesToFolder,
  deleteGalleryImage,
  getBannerImages,
  getImagesGallary,
  getFolderGallary,
  uploadVideo,
  getVideos,
  deleteVideo
}
