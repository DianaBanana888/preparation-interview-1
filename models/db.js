const mongoose = require('mongoose');

const dbName = 'ClientProject';
const dbPath = `mongodb://localhost:27017/${dbName}`;

mongoose.connect(dbPath, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
module.exports = mongoose.connection;
