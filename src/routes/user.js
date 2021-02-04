const express = require('express');
const { isAuth } = require('../../middleware/auth');
const Round = require('../../models/Round');
// const User = require('../../models/User');

// const app = require('../../app');

const router = express.Router();

router.get('/', isAuth, async (req, res) => {
  // eslint-disable-next-line no-console
  // eslint-disable-next-line no-underscore-dangle
  const rounds = await Round.find({ user: req.session.user._id }).populate('deck').lean();
  res.render('user/profile.hbs', { rounds });
});

module.exports = router;
