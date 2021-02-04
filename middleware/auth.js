const bcrypt = require('bcrypt');
const User = require('../models/User');

const isNotFound = (req, res) => {
  res.status(404).render('404.hbs');
};
const isError = (err, req, res) => {
  console.error(err);
  res.status(500).render('/error');
};
const isLocalName = (req, res, next) => {
  if (req.session.user) res.locals.username = req.session?.user?.name;
  next();
};

const isValidPassword = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!(await bcrypt.compare(password, user.password))) {
    res.json({ message: 'Неправильный пароль, попробуйте еще раз' });
  } else next();
};

const isAuth = async (req, res, next) => {
  if (!req.session.user) {
    res.render('user/noAuth.hbs');
  } else next();
};

const isAlreadyRegistered = async (req, res, next) => {
  const { email } = req.body;
  if (await User.findOne({ email })) {
    res.json({ message: 'Пользователь с таким паролем уже существует' });
  } else { next(); }
};

const isAdmin = async (req, res, next) => {
  if (req.session.user.id === (await User.findOne({ email: 'superuser@gmail.com' })).id) {
    next();
  } else {
    res.json({ message: 'У вас недостаточно прав, извините' });
  }
};

module.exports = {
  isNotFound,
  isError,
  isLocalName,
  isAuth,
  isAdmin,
  isAlreadyRegistered,
  isValidPassword,
};
