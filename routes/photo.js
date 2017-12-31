const express = require('express');
const router = express.Router();
const Photo = require('../controllers/photo')
const authentification = require('../middlewares/authentification')
const uploadImage = require('../middlewares/uploadImages')

router.get('/', authentification, Photo.get)
router.get('/:id', authentification, Photo.getSingle)
router.post('/', authentification,
  uploadImage.multer.single('image'),
  uploadImage.sendUploadToGCS, Photo.create)
router.put('/:id', authentification, Photo.update)
router.delete('/:id', authentification, Photo.destroy)

module.exports = router