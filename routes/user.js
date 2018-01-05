const express = require('express');
const router = express.Router();
const User = require('../controllers/user')
const authentification = require('../middlewares/authentification')

router.get('/', authentification, User.get)
router.get('/:id', authentification, User.getSingle)
router.put('/:id', authentification, User.update)
router.delete('/:id', authentification, User.destroy)
router.put('/follow/:id', authentification, User.follow)

module.exports = router