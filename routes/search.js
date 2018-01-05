const express = require('express');
const router = express.Router();
const Search = require('../controllers/search')
const authentification = require('../middlewares/authentification')

router.get('/:search', authentification, Search.getSearch)
module.exports = router
