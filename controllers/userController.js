const User = require('../models/User');
const { getCurrentDateWithTimeZone } = require('../utils/getCurrentDateWithTimeZone');

exports.getAllUsers = async (req, res, next) => {
  try {
    const { rows: users } = await User.getAll(req.query);

    res.status(200).json({
      users,
      totalCount: users.length,
    });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { rows: [user] } = await User.getById(userId);

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};

exports.editUserData = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const bodyValues = req.body;

    const updated_at = getCurrentDateWithTimeZone();

    const { rows: [user] } = await User.editData({ ...bodyValues, updated_at }, userId);

    res.status(201).json({ message: 'User has been successfuly updated!', data: user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    await User.delete(userId);

    res.status(200).json({ message: 'User has been successfuly deleted!' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/* exports.updateUserRating = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { rating } = req.body;

    await User.updateRating(rating, userId);

    res.status(201).json({ message: 'User\'s rating has been successfuly updated!' });
  } catch (error) {
    console.log(error);
    next(error);
  }
}; */
