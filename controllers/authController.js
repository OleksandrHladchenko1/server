const { isEmpty, omit } = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Auth = require('../models/Auth');

exports.registerUser = async (req, res, next) => {
  try {
    const {
      email,
      password,
      passwordConfirm,
    } = req.body;
    const { rows: [user] } = await Auth.getUserByEmail(email);

    if(isEmpty(user)) {
      if(password !== passwordConfirm) {
        return res.status(400).json({ message: 'Passwords don\'t match!' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const { rows: [newUser] } = await Auth.registerUser({ ...req.body, password: hashedPassword });

      return res.status(201).json({ message: 'User has been successfuly registered!', data: newUser });
    }

    return res.status(400).json({ message: `User with email '${email}' already exists!` });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { rows: [user] } = await Auth.getUserByEmail(email);

    if(!isEmpty(user)) {
      if(!bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ message: 'Passwords don\'t match!' });
      }

      const token = jwt.sign({ email }, 'test', { expiresIn: '1h' });

      return res.status(200).json({
        message: 'Successfuly logged in!',
        data: {
          user: { ...omit(user, 'password') },
          token,
        }      
      });
    }

    return res.status(400).json({ message: `User with email '${email}' doesn't exists!` });    
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const {
      email,
      password,
      passwordConfirm,
    } = req.body;
    const { rows: [user] } = await Auth.getUserByEmail(email);

    if(password !== passwordConfirm) {
      return res.status(400).json({ message: 'New passwords are NOT the same!' });
    }

    if(bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ message: 'Old and new password are the same!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Auth.changePassword({ email, password: hashedPassword });

    return res.status(200).json({ message: 'User\'s password has been successfuly updated!' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};