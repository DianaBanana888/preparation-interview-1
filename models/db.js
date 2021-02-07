const mongoose = require('mongoose');
const connectMongo = require('connect-mongo');
const session = require('express-session');
require('dotenv').config();

const dbName = 'ClientProject';
const dbPath = `mongodb+srv://foxteam1:c1ientProject@cluster0.h3487.mongodb.net/${dbName}`;
const MongoStore = connectMongo(session);

mongoose.connect(process.env.DB_PATH, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Mongoose connected to %s database', process.env.DB_PATH);
  })
  .catch((err) => {
    console.log('Database connection error', err.message);
  });

const sessionStore = new MongoStore({
  mongooseConnection: mongoose.createConnection(process.env.SESSION_DB_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }),
});

module.exports = sessionStore;
