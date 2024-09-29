const express = require('express');

const router = express.Router();

const lotController = require('../controllers/lotController');

router.route('/getByStatus')
  .get(lotController.getLotsByStatus);

router.route('/getByTitle')
  .get(lotController.getLotByTitle);

router.route('/getByCategory/:categoryId')
  .get(lotController.getLotsByCategory);

router.route('/')
  .get(lotController.getAllLots)
  .post(lotController.createNewLot);

router.route('/:id')
  .get(lotController.getLotById)
  .delete(lotController.deleteLot)
  .patch(lotController.editLotData);
  
router.route('/user/:id')
  .get(lotController.getLotsByUserId);

module.exports = router;
