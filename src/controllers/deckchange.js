/* eslint-disable no-underscore-dangle */
const User = require('../../models/User');
const Deck = require('../../models/Deck');
const Card = require('../../models/Card');
// const app = require('../../app');
// ADMIN
async function deckEdit(req, res) {
  const { userName } = req.app.locals.username;
  const userId = await User.findOne({ name: userName })._id;
  // const obj = {
  //   id: 123,
  //   title: 'Test',
  //   dataArr: [{q:'test',a:'test'},{q:'test',a:'test'},{q:'test',a:'test'},{q:'test',a:'test'}],
  // };
  const obj = req.body;
  let idD;
  let cardArr;
  if (obj.id === '' || obj.id === undefined) {
    const deck = await Deck.findOne({ title: obj.title, userid: userId }).lean();
    let title = `${obj.title}`;
    if (!deck) {
      title = `${obj.title}*`;
    }
    idD = await Deck.create({ title, titlerus: obj.title, userid: userId });
  } else {
    idD = await Deck.findOneAndUpdate({ _id: obj.id, userid: userId },
      { $set: { title: obj.title, titlerus: obj.title } },
      { useFindAndModify: false, new: true }).exec();
    await Card.deleteMany({ deckid: idD._id });
  }
  if (idD) {
    cardArr = await obj.dataArr.map(async (el) => {
      const cardN = await Card.create({
        question: el.q,
        answer: el.a,
        deckid: idD._id,
      });
      return cardN;
    });
  }
  if (idD && cardArr) res.json('Ok');
  else res.json('Err');
}
module.exports = deckEdit;
