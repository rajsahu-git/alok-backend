const express = require('express')
const upload = require('../upload/multer')
const {
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
} = require('../controllers/galleryController')

const router = express.Router()

// Folder routes
router.post('/folder', createGalleryFolder)
router.get('/folders', getGalleryFolders)
router.delete('/folder/:id', deleteGalleryFolder)

// Image routes
router.get('/folder/:id/images', getImagesInFolder)
router.post('/folder/:id/images', upload.array('images', 20), uploadImagesToFolder)
router.delete('/image/:fileId', deleteGalleryImage)

router.get('/banner-images', getBannerImages)

router.get('/image-gallery/:folder_id',  getImagesGallary)
router.get('/folder-gallery', getFolderGallary)

router.post('/video', uploadVideo)
router.get('/video', getVideos)
router.delete('/video/:id', deleteVideo)



module.exports = router
