const express = require('express');

const Deck = require('../../models/Deck');
const Card = require('../../models/Card');
const User = require('../../models/User');

const app = require('../../app');
const router = express.Router();

// router.get('/register', async (req, res) => {
//   res.render('user/register.hbs');
// });
// имя пользователя с сервера - name
router.post('/register', async (req, res) => {
  const nameFromFront = req.body.login;
  console.log('nameFromFrontnameFromFrontnameFromFront', nameFromFront);
  const nameFromDB = await User.findOne({ name: nameFromFront });
  if (nameFromDB) {
    res.json({ message: 'Пользователь с таким именем уже существует' });
  } else {
    await User.create({ name: nameFromFront });
    req.app.locals.username = nameFromFront;
    res.json({ message: 'OK' });
  }
});

// router.get('/login', async (req, res) => {
//   res.render('user/login.hbs');
// });
// POST/login - проверить, есть ли в БД, если есть авторизация через req.app.locals.username,
//  должна появиться какая-то фраза в случае успешной авторизации или неправильного логин, redirect /
router.post('/login', async (req, res) => {
  const nameFromFront = req.body.login;
  const nameFromDB = await User.findOne({ name: nameFromFront });
  if (nameFromDB) {
    req.app.locals.username = nameFromFront;
    res.json({ message: 'OK' });
  } else {
    res.json({ message: 'Пользователь с таким именем не зарегистрирован' });
  }
});
router.get('/logout', async (req, res) => {
  req.app.locals.username = null;
  res.redirect('/');
});

module.exports = router;
