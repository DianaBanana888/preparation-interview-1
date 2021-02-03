const mongoose = require('mongoose');

const RoundSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  deck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
  },
  date: { type: Date, default: Date.now },
  tries: {
    type: Number,
    default: 0,
  },
  points: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Round', RoundSchema);
