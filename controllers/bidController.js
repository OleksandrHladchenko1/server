const EventBid = require('../models/EventBid');

exports.getAllEventBids = async (req, res, next) => {
  try {
    const { rows: eventBids, rowCount } = await EventBid.getAllEventBids(req.query, req.params.eventId);

    res.status(200).json({
      eventBids,
      totalCount: rowCount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};

exports.createNewEventBid = async (req, res, next) => {
  try {
    const eventBid = new EventBid(req.body);

    const { rows: [newEventBid] } = await eventBid.save();
    
    res.status(201).json({ message: 'Event bid has been successfuly created!', data: newEventBid });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getEventBidById = async (req, res, next) => {
  try {
    const eventBidId = req.params.id;
    const { rows: [eventBid] } = await EventBid.getEventBidById(eventBidId);

    if(!eventBid) {
      res.status(404).json({ message: `Event bid with id ${eventBidId} was not found!` });
    }

    res.status(200).json({ eventBid });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};

exports.editEventBidData = async (req, res, next) => {
  try {
    const eventBidId = req.params.id;
    const bodyValues = req.body;

    const { rows: [eventBid] } = await EventBid.editEventBidData(bodyValues, eventBidId);

    res.status(201).json({ message: 'Event bid has been successfuly updated!', data: eventBid });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteEventBid = async (req, res, next) => {
  try {
    const eventBidId = req.params.id;

    await EventBid.deleteEventBid(eventBidId);

    res.status(200).json({ message: 'Event bid has been successfuly deleted!' });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};
