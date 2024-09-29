const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

router.route('/')
  .get(userController.getAllUsers);

router.route('/:id')
  .get(userController.getUserById)
  .patch(userController.editUserData)
  .delete(userController.deleteUser);

/* router.route('/rating/:id')
  .patch(userController.updateUserRating); */

module.exports = router;
