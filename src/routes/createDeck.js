const express = require('express');

const Deck = require('../../models/Deck');

const router = express.Router();



router.get('/', async (req, res) => {
  if (res.app.locals.username) {
    res.render('createDeck.hbs', {});
  } else {
    res.render('user/noAuth.hbs', {})
  }

});

module.exports = router;
