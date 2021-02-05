/* eslint-disable consistent-return */
/* eslint-disable no-multi-str */
const bcrypt = require('bcrypt');
const User = require('../models/User');

const isNotFound = (req, res) => {
  res.status(404).render('404.hbs');
};
const isError = (err, req, res) => {
  console.error(err);
  res.status(500).render('/error');
};
const isLocalName = async (req, res, next) => {
  if (req.session.user) {
    res.locals.username = req.session?.user?.name;
    if (req.session.user.id === (await User.findOne({ email: 'superuser@gmail.com' })).id) {
      res.locals.nameAdmin = true;
    } else {
      res.locals.nameAdmin = false;
    }
  }
  next();
};

const isCorrectInput = async (req, res, next) => {
  const { name, password } = req.body;
  const regPas = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,30}$/);
  const regName = new RegExp(/^[а-яёА-Яa-zA-Z0-9_]{4,20}$/);

  if (!regName.test(name)) {
    return res.json({
      message: 'Имя должно быть не менее 4 символов и не более 20.\
      Имя должно содержать буквы или цифры.',
    });
  }

  if (!regPas.test(password)) {
    return res.json({
      message: 'Пароль должен быть не менее 6 символов и не более 30.\
      Пароль должен содержать минимум одну латинскую заглавную букву,\
      одну латинскую строчную букву и одну цифру.',
    });
  }

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
  const candidate = await User.findOne({ email });
  if (candidate) {
    return res.status(400).json({ message: 'Пользователь с таким емэйлом уже существует' });
  } next();
};

const isAdmin = async (req, res, next) => {
  if (res.locals.nameAdmin) {
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
  isCorrectInput,
};
