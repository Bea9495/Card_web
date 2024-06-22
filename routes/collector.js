const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer');
const collectorController = require('../controllers/collectorController');
const validateCollectorRules = require('../middlewares/collectorValidator');


router.get('/oneCollector/:id', collectorController.oneCollector);
router.get('/addCollector', collectorController.formAddCollector);
router.post('/addCollector', multer("collector"), validateCollectorRules, collectorController.showPost);
router.get('/editCollector/:id', collectorController.editCollector);
router.post('/editCollector/:id', multer("collector"), collectorController.showEditPost);
router.get('/deleteLogicCollector/:id', collectorController.deleteLogicCollector);
router.get('/login', collectorController.showLogin);
router.post('/login', collectorController.login);






module.exports = router;
