const Lot = require('../models/Lot');

exports.getAllLots = async (req, res, next) => {
  try {
    const { rows: lots, rowCount } = await Lot.getAll(req.query);

    res.status(200).json({
      lots,
      totalCount: rowCount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};

exports.createNewLot = async (req, res, next) => {
  try {  
    const lot = new Lot(req.body);

    const { rows: [newLot] } = await lot.save();

    res.status(201).json({ message: 'Lot has been successfuly created!', data: newLot });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getLotById = async (req, res, next) => {
  try {
    const lotId = req.params.id;
    const { rows: [lot] } = await Lot.getById(lotId);

    if(!lot) {
      res.status(404).json({ message: `Lot with id ${lotId} was not found!` });
    }

    res.status(200).json({ lot });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};

exports.getLotsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { rows: lots, rowCount } = await Lot.getByUserId(userId);

    res.status(200).json({
      lots,
      totalCount: rowCount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};

exports.getLotsByCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const { rows: lots, rowCount } = await Lot.getByCategory(categoryId);

    res.status(200).json({
      lots,
      totalCount: rowCount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};

exports.editLotData = async (req, res, next) => {
  try {
    const lotId = req.params.id;
    const bodyValues = req.body;

    const { rows: [lot] } = await Lot.editData(bodyValues, lotId);

    res.status(201).json({ message: 'Lot has been successfuly updated!', data: lot });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getLotsByStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { rows: lots, rowCount } = await Lot.getByStatus(status);

    res.status(200).json({
      lots,
      totalCount: rowCount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};

exports.getLotByTitle = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { rows: lots, rowCount } = await Lot.getByTitle(title);

    res.status(200).json({
      lots,
      totalCount: rowCount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};

exports.deleteLot = async (req, res, next) => {
  try {
    const lotId = req.params.id;

    await Lot.delete(lotId);

    res.status(200).json({ message: 'Lot has been successfuly deleted!' });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};
