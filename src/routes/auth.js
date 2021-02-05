const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../../models/User');

const router = express.Router();
const { isAlreadyRegistered, isValidPassword, isCorrectInput } = require('../../middleware/auth');

// router.get('/register', async (req, res) => {
//   res.render('user/register.hbs');
// });
router.post('/register', isAlreadyRegistered, isCorrectInput, async (req, res) => {
  const { name, email, password } = req.body;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = await new User({
    name,
    password: hashedPassword,
    email,
  }).save();
  req.session.user = { id: user.id, name: user.name };
  return res.json({ message: 'OK' });
});

// router.get('/login', async (req, res) => {
//   res.render('user/login.hbs');
// });
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
