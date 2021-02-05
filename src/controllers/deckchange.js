/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
const User = require('../../models/User');
const Deck = require('../../models/Deck');
const Card = require('../../models/Card');
// const app = require('../../app');
// ADMIN
async function deckEdit(req, res) {
  // const { userName } = req.app.locals.username;

  const userId = await User.findOne({ name: req.session.user })._id;
  // const obj = {
  //   id: 123,
  //   title: 'Test',
  //   dataArr: [{q:'test',a:'test'},{q:'test',a:'test'},{q:'test',a:'test'},{q:'test',a:'test'}],
  // };
  const obj = req.body;
  let idD;
  let cardArr;
  let title = `${obj.title.trim()}`;
  let key = `${title.toLowerCase()}`;
  if (obj.id === '' || obj.id === undefined || obj.id === null) {
    const deck = await Deck.findOne({ title }).lean();// , userid: userId
    if (deck) {
      // eslint-disable-next-line no-sequences
      key = `${title.toLowerCase()}*`;
      title = `${title}*`;
    }
    idD = await Deck.create({
      key, title, userid: userId,
    });
  } else {
    idD = await Deck.findOneAndUpdate({ _id: obj.id },
      { $set: { title } },
      { useFindAndModify: false, new: true }).exec();
    // await Card.deleteMany({ deckid: idD._id });
  }
  if (idD) {
    cardArr = await obj.dataArr.map(async (el) => {
      const cardN = await Card.create({
        level: el.level,
        question: el.quastion,
        answer: el.anserTrue,
        answerArr: el.AllAnswer,
        deckid: idD._id,
      });
      return cardN;
    });
  }
  if (idD && cardArr) res.json('Ok');
  else res.json('Err');
}

module.exports = deckEdit;
