const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const Feeder = require('./src/controllers/feeder');
const UserService = require('./src/controllers/user');

// Load dotenv
require('dotenv').config()

// Setup express
const app = express();
const port = process.env.PORT || 3000;

// Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = "mongodb://" + process.env.MONGO_USER + ':' + process.env.MONGO_PASS +  "@ds115353.mlab.com:15353/" + process.env.MONGO_DB;
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true } );
mongoose.Promise = global.Promise;
mongoose.set('debug', true);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const ClientFeeder = new Feeder({ token: process.env.GITHUB_TOKEN });

// Enable CORS for the client app
app.use(cors());

// Get users by canton
app.get('/users/canton/:canton', (req, res, next) => { // eslint-disable-line no-unused-vars
  UserService.users_canton(req.params.canton)
    .then(user => res.send(user))
    .catch(next);
});

// Get user by canton and language
app.get('/users/canton/:canton/language/:language', (req, res, next) => { // eslint-disable-line no-unused-vars
  UserService.users_canton_and_language(req.params.canton, req.params.language, res)
    .then(user => res.send(user))
    .catch(next);
});

// Get number of users per canton
app.get('/users/canton/:canton/count', (req, res, next) => { // eslint-disable-line no-unused-vars
  UserService.users_canton_count(req.params.canton)
    .then(user => res.send(user))
    .catch(next);
});

// Get users by languages
app.get('/users/language/:language', (language, res, next) => { // eslint-disable-line no-unused-vars
  console.log(req.params.language);
  UserService.users_language(req.params.language)
    .then(user => res.send(user))
    .catch(next);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening at http://localhost:${port}`);
});

// Feeding the databases
app.get('/feed/', (req, res, next) => { // eslint-disable-line no-unused-vars
  ClientFeeder.feed();
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(err.status || 500);
  res.send(err.message);
});

// Schedule the feeder to launch one time per day at 05:00 at morning
// We made this choice because we don't want to have a high load of requests and processing
// during the users visits.
cron.schedule('*/30 * * * *', () => {
  ClientFeeder.feed();
});

