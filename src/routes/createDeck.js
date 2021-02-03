const express = require('express');
const { isAdmin } = require('../../middleware/auth');

// const Deck = require('../../models/Deck');

const router = express.Router();

router.get('/', isAdmin, async (req, res) => {
  res.render('createDeck.hbs', {});
});

module.exports = router;
