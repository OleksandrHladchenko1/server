const express = require('express');

const router = express.Router();

const participantController = require('../controllers/participantController');

router.route('/event/:eventId')
  .get(participantController.getAllEventParticipants);

router.route('/')
  .post(participantController.createNewParticipant);
  
router.route('/:id')
  .get(participantController.getParticipantById)
  .patch(participantController.editParticipantData)
  .delete(participantController.deleteParticipant);  

module.exports = router;
