const Participant = require('../models/Participant');

exports.getAllEventParticipants = async (req, res, next) => {
  try {
    const { rows: participants, rowCount } = await Participant.getEventParticipants(req.query, req.params.eventId);

    res.status(200).json({
      participants,
      totalCount: rowCount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};

exports.createNewParticipant = async (req, res, next) => {
  try {
    const participant = new Participant(req.body);

    const { rows: [newParticipant] } = await participant.save();
    
    res.status(201).json({ message: 'Participant has been successfuly created!', data: newParticipant });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getParticipantById = async (req, res, next) => {
  try {
    const participantId = req.params.id;
    console.log({ participantId });
    const { rows: [participant] } = await Participant.getById(participantId);

    res.status(200).json({ participant });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};

exports.editParticipantData = async (req, res, next) => {
  try {
    const participantId = req.params.id;
    const { rows: [participant] } = await Participant.editData(req.body, participantId);

    res.status(201).json({ message: 'Participant has been successfuly updated!', data: participant });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteParticipant = async (req, res, next) => {
  try {
    const participantId = req.params.id;

    await Participant.delete(participantId);

    res.status(200).json({ message: 'Participant has been successfuly deleted!' });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};
