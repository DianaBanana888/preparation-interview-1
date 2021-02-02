const express = require('express');

const Deck = require('../../models/Deck');
// const Card = require('../../models/Card');

const router = express.Router();

router.get('/', async (req, res) => {
  const decks = await Deck.find().lean();
  res.render('index.hbs', { decks });
});

// router.get('/card', async (req, res) => {
//   const deck = await Deck.findOne({title: 'AnimalQuiz'});
//   console.log(deck);
//   const cards = await Card.find({deckid: deck._id}).lean();
//   console.log(cards)
//   res.render('deck/card.hbs', { card: cards[0] });
// });

module.exports = router;
