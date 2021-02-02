/* eslint-disable import/order */
const db = require('./db');
const fs = require('fs').promises;
const Deck = require('./Deck');
const Card = require('./Card');
const path = require('path');

db.on('open', () => { console.log('Start DB'); }).on('error', console.error.bind(console, 'connection error:'));

const seed = async () => {
  await db.dropDatabase();
  const pathFile = path.join(__dirname, '../models/fileseed/db.json');
  const json = JSON.parse(await fs.readFile(pathFile, 'utf8'));
  return Object.entries(json).map(async ([key, value]) => {
    const elDeck = await Deck.create({ key, title: value.title });
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
  // console.log('Database seed is finished');
};
seed();
