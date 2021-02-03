/* eslint-disable no-underscore-dangle */
const express = require('express');
const deckEdit = require('../controllers/deckchange');
const { isAdmin } = require('../../middleware/auth');

const router = express.Router();

router.post('/', isAdmin, deckEdit);

module.exports = router;
