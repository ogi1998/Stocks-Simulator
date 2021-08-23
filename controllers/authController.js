const User = require('../models/User');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');
const errorController = require('./errorController');

const signJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

module.exports.loginGet = (req, res) => {
  const user = res.locals.user;
  if(user) res.redirect('/');
  else res.render('login');
}

// Login errors are err.message since we are throwing new errors
module.exports.loginPost = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.login(username, password);
    const token = signJWT(user._id);
    res.cookie('jwt', token, {
      httpOnly: true,
    });
    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: errorController.getLoginErrors(err),
    });
  }
};

module.exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/login');
};

module.exports.registerGet = (req, res) =>   {
  const user = res.locals.user;
if(user) res.redirect('/');
else res.render('register');
}

module.exports.registerPost = async (req, res) => {
  const { username, email, firstName, lastName, password, passwordConfirm } =
    req.body;
  try {
    const user = await User.create({
      username,
      email,
      firstName,
      lastName,
      password,
      passwordConfirm,
    });
    const token = signJWT(user._id);
    res.cookie('jwt', token, {
      httpOnly: true,
    });
    res.status(201).json({
      status: 'success',
      message: 'You have been successfully registered'
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: errorController.getRegisterErrors(err),
    });
  }
};
