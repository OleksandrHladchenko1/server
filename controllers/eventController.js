const Event = require('../models/Event');

exports.getAllEvents = async (req, res, next) => {
  try {
    const { rows: events, rowCount } = await Event.getAll(req.query);

    res.status(200).json({
      events,
      totalCount: rowCount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};

exports.createNewEvent = async (req, res, next) => {
  try {
    const { lot_id, start_time } = req.body;
    const event = new Event({ lot_id, start_time });

    const { rows: [newEvent] } = await event.save();
    
    res.status(201).json({ message: 'Event has been successfuly created!', data: newEvent });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const { rows: [event] } = await Event.getById(eventId);

    if(!event) {
      res.status(404).json({ message: `Event with id ${eventId} was not found!` });
    }

    res.status(200).json({ event });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};

exports.editEventData = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const bodyValues = req.body;

    const { rows: [event] } =await Event.editData(bodyValues, eventId);

    res.status(201).json({ message: 'Event has been successfuly updated!', data: event });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;

    await Event.delete(eventId);

    res.status(200).json({ message: 'Event has been successfuly deleted!' });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};
