/* eslint-disable no-underscore-dangle */
const express = require('express');
const deckEdit = require('../controllers/deckchange');

const router = express.Router();

router.post('/', deckEdit);

module.exports = router;
