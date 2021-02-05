const express = require('express');
const { isAuth } = require('../../middleware/auth');
const Round = require('../../models/Round');
// const User = require('../../models/User');

// const app = require('../../app');

const router = express.Router();

function formatDate(date) {
  const options = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  };
  return date.toLocaleDateString('ru-RU', options);
}

router.get('/', isAuth, async (req, res) => {
  // eslint-disable-next-line no-console
  // eslint-disable-next-line no-underscore-dangle
  const rounds = await Round.find({ user: req.session.user.id, tries: { $gt: 0 } }).populate('deck').lean();
  const roundArr = rounds.map((el) => {
    const arr = ['Легкий уровень', 'Средний уровень', 'Высокий уровень'];
    return {
      user: el.user,
      deck: el.deck,
      date: formatDate(el.date),
      tries: el.tries,
      points: el.points,
      level: arr[el.level - 1],
    };
  });
  res.render('user/profile.hbs', { rounds: roundArr });
});

module.exports = router;
