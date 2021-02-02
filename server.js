const app = require('./app');
const db = require('./models/db');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server started at http://localhost:%s/', port);
});

db.on('open', () => { console.log('Start DB'); }).on('error', console.error.bind(console, 'connection error:'));
