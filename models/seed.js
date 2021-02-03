/* eslint-disable no-underscore-dangle */
/* eslint-disable import/order */
const db = require('./db');
const fs = require('fs').promises;
const Deck = require('./Deck');
const Card = require('./Card');
const path = require('path');

db.on('open', () => { console.log('Start DB'); }).on('error', console.error.bind(console, 'connection error:'));
// const fileName = 'html_level3.json';
const seed = async (file) => {
  const pathFile = path.join(__dirname, `../models/fileseed/${file}`);
  const json = JSON.parse(await fs.readFile(pathFile, 'utf8'));
  let elDeck;
  Object.entries(json).map(async ([key, value]) => {
    console.log('@@@@@', key);
    elDeck = await Deck.findOne({ key });
    if (!elDeck) elDeck = await Deck.create({ key, title: value.title });
    const cardArr = await value.arr.map(async (el) => {
      const elCard = await Card.create({
        level: el.level,
        question: el.question,
        answer: el.answer,
        answerArr: el.answerArr,
        // eslint-disable-next-line no-underscore-dangle
        deckid: elDeck._id,
      });
      return elCard;
    });
    return cardArr;
  });
};
seed('html_level.json');
