const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer');
const indexController = require('../controllers/indexController');
const validateCollectorRules = require('../middlewares/collectorValidator');


router.get('/', indexController.showHome);

module.exports = router;
