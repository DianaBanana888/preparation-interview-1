const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    match: /^[а-яёА-Яa-zA-Z0-9_]{4,20}$/i,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    match: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,15}$/i,
  },
});

module.exports = mongoose.model('User', UserSchema);
