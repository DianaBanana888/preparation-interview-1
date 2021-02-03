const mongoose = require('mongoose');

const dbName = 'ClientProject';
const dbPath = `mongodb+srv://foxteam1:c1ientProject@cluster0.h3487.mongodb.net/${dbName}`;

mongoose.connect(dbPath, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
module.exports = mongoose.connection;
