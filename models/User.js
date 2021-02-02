const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    // minlength: 4,
    // match: /^[A-Z]\w+$/i,
  },
  /*  password: {
     type: String,
     required: true,
   },
   email: {
     type: String,
     required: true,
     minlength: 3,
     match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
     unique: true,
   },Закомментировано временно пока нет сохранения в авторизации */
});

module.exports = mongoose.model('User', UserSchema);
