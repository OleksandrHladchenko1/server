const express = require('express');

const router = express.Router();

const eventController = require('../controllers/eventController');

router.route('/')
  .get(eventController.getAllEvents)
  .post(eventController.createNewEvent);
  
router.route('/:id')
  .get(eventController.getEventById)
  .patch(eventController.editEventData)
  .delete(eventController.deleteEvent);  

module.exports = router;
