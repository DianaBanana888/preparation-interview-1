const express = require('express');

const Round = require('../../models/Round');
const User = require('../../models/User');

// const app = require('../../app');

const router = express.Router();

router.get('/', async (req, res) => {
  // eslint-disable-next-line no-console
  console.log(req.body.login);
  if (req.app.locals.username) {
    const userName = req.app.locals.username;
    const user = await User.findOne({ name: userName });
    // eslint-disable-next-line no-underscore-dangle
    const rounds = await Round.find({ user: user._id }).populate('deck').lean();
    res.render('user/profile.hbs', { rounds });
  } else {
    res.render('user/noAuth.hbs', {});
  }
});

module.exports = router;
