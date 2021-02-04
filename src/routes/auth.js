const express = require('express');
const bcrypt = require('bcrypt');

// const Deck = require('../../models/Deck');
// const Card = require('../../models/Card');
const User = require('../../models/User');

// const app = require('../../app');

const router = express.Router();
const { isAlreadyRegistered, isValidPassword } = require('../../middleware/auth');

// router.get('/register', async (req, res) => {
//   res.render('user/register.hbs');
// });
// имя пользователя с сервера - name
router.post('/register', isAlreadyRegistered, async (req, res) => {
  const { name, email, password } = req.body;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = await new User({
    name,
    password: hashedPassword,
    email,
  }).save();
  req.session.user = { id: user.id, name: user.name };
  res.json({ message: 'OK' });
  // res.redirect('/');
});

// router.get('/login', async (req, res) => {
//   res.render('user/login.hbs');
// });
// POST/login - проверить, есть ли в БД, если есть авторизация через req.app.locals.username,
//  должна появиться какая-тофраза в случае успешной авторизации или неправильного логин, redirect /
router.post('/login', isValidPassword, async (req, res) => {
  const { email } = req.body;
  console.log('Route', req.body);
  const user = await User.findOne({ email });
  req.session.user = { id: user.id, name: user.name };
  res.json({ message: 'OK' });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.clearCookie('sid');
    res.redirect('/');
  });
});

module.exports = router;
