const express = require('express');

const router = express.Router();

const bidController = require('../controllers/bidController');

router.route('/event/:eventId')
  .get(bidController.getAllEventBids);

router.route('/')
  .post(bidController.createNewEventBid);

router.route('/:id')
  .get(bidController.getEventBidById)
  .patch(bidController.editEventBidData)
  .delete(bidController.deleteEventBid);

module.exports = router;
