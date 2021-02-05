const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const logger = require('morgan');
const hbs = require('hbs');
const Deck = require('./models/Deck');

const sessionStore = require('./models/db.js');

const app = express();

// const indexRoute = require('./src/routes/index');
const userRoute = require('./src/routes/user');
// const registerRoute = require('./src/routes/user');
// const indexRoute = require('./src/routes/index');
const createDeckRoute = require('./src/routes/createDeck');
const authRoute = require('./src/routes/auth');
const editdackRoute = require('./src/routes/editDack');
const deckRoute = require('./src/routes/deck');
const { isLocalName, isNotFound } = require('./middleware/auth');

// view engine setup
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'src', 'views', 'partials'));

/*app.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 365,
    },
  }),
);*/
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src', 'views')));

app.use(isLocalName);
app.get('/', async (req, res) => {
  const decks = await Deck.find().lean();
  res.render('index.hbs', { decks });
});
// app.use('/', indexRoute);
app.use('/user', userRoute);
app.use('/createDeck', createDeckRoute);
app.use('/editdack', editdackRoute);
app.use('/auth', authRoute);
app.use('/editdack', editdackRoute);
app.use('/deck', deckRoute);
app.use(isNotFound);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
