const express = require('express');
const router = express.Router();
const Photo = require('../controllers/photo')
const authentification = require('../middlewares/authentification')
const uploadImage = require('../middlewares/uploadImages')

router.get('/', authentification, Photo.getTimeline)
router.get('/:id', authentification, Photo.getSingle)
router.post('/', authentification,
  uploadImage.multer.single('image'),
  uploadImage.sendUploadToGCS, Photo.create)
router.put('/:id', authentification, Photo.update)
router.delete('/:id', authentification, Photo.destroy)
router.post('/comment/:id', authentification, Photo.comment)
router.put('/like/:id', authentification, Photo.like)
module.exports = router
