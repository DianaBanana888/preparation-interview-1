/* eslint-disable no-underscore-dangle */
const express = require('express');

const Round = require('../../models/Round');
const User = require('../../models/User');
const Deck = require('../../models/Deck');
const Card = require('../../models/Card');
const { isAuth } = require('../../middleware/auth');

// const app = require('../../app');

const router = express.Router();

// router.get('/solve', async (req, res) => {
//   const card = await Card.findOne({ _id: req.query.card }).select('question answerArr').lean();
//   res.render('deck/card.hbs', { card });
// })

router.post('/check', isAuth, async (req, res) => {
  const rightAnswer = await Card.findOne({ _id: req.body.questID }).select('answer').lean();
  const result = (req.body.userAnswer.trim() === rightAnswer.answer.trim());
  await Round.updateOne({ _id: req.body.roundID }, { $inc: { tries: 1, points: Number(result) } });
  res.json(result);
});

router.post('/finish', isAuth, async (req, res) => {
  const arr = ['Легкий уровень', 'Средний уровень', 'Высокий уровень'];
  const round = await Round.findOne({ _id: req.body.roundID }).populate('deck').lean();// .select('tries points -_id')
  res.json({
    tries: round.tries, points: round.points, deck: round.deck.title, level: arr[round.level - 1],
  });
});

router.post('/', isAuth, async (req, res) => {
  const card = await Card.find({ deckid: req.body.id, level: req.body.level }).select('level question answerArr').lean();
  const cards = card.sort(() => Math.random() - 0.5);
  const deck = await Deck.findOne({ _id: req.body.id });
  let user = {};
  if (req.session.user.id) user = await User.findOne({ _id: req.session.user.id });
  const newRound = new Round({
    user: user._id,
    deck: deck._id,
    level: req.body.level,
  });
  await newRound.save();
  return res.json({ roundID: newRound.id, cards });
});

router.get('/:id', isAuth, async (req, res) => {
  /* const cards = await Card.find({ deckid: req.params.id }).select('question answerArr').lean();
   const deck = await Deck.findOne({ _id: req.params.id });
   let user = {};
   if (req.app.locals.username) user = await User.findOne({ name: req.app.locals.username });
   const newRound = new Round({
     user: user._id,
     deck: deck._id,
   });
   await newRound.save();
   res.json({ roundID: newRound.id, cards }); */
  res.json({ id: req.params.id });
});

module.exports = router;
