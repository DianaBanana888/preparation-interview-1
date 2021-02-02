const mongoose = require('mongoose');

const DeckSchema = mongoose.Schema({
  key: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    require: true,
  },
  private: {
    type: Boolean,
    default: false,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Deck', DeckSchema);
