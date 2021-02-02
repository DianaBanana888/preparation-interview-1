const mongoose = require('mongoose');

const CardSchema = mongoose.Schema({
  level: { type: Number },
  question: {
    type: String,
  },
  answer: {
    type: String,
  },
  answerArr: [String],
  deckid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
  },
});

module.exports = mongoose.model('Card', CardSchema);
