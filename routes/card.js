const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer');
const cardController = require('../controllers/cardController');

router.get('/addCard/:id', cardController.showFormAddCard);
router.post('/addCard/:id', multer("card"), cardController.addCard);
router.get('/editCard/:id',cardController.showEditCard);
router.post('/editCard/:id/:collector_id',multer("card"), cardController.editCard);
router.get('/deleteCard/:id/:collector_id', cardController.deleteCard);
router.get('/deleteLogicCard/:id/:collector_id', cardController.deleteLogicCard);
router.get('/allCard', cardController.showAllCard);

module.exports = router;
