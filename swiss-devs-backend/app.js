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
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const ClientFeeder = new Feeder({ token: process.env.GITHUB_TOKEN });

// Enable CORS for the client app
app.use(cors());

/*var user = new User({
  username: "toto"
});
user.save().then((obj) => console.log("Collection: " + obj + User.find().byUsername("toto").toString()));
const client = new Feeder({ token: process.env.GITHUB_TOKEN, db });*/


/**
 * - getUsers() : Return all Switzerlands developers
 * - getUsers(var canton) : Return all Switzerlands developers from one specific canton
 */

app.get('/users/', (req, res, next) => { // eslint-disable-line no-unused-vars
  UserService.all(req, res);
});

app.get('/users/:langage', (req, res, next) => { // eslint-disable-line no-unused-vars
  UserService.users_langage(req, res);
});

app.get('/users/canton/:canton', (req, res, next) => { // eslint-disable-line no-unused-vars
  ClientFeeder.user(req.params.canton)
    .then(user => res.send(user))
    .catch(next);
});


app.get('/users/langages/:langage', (req, res, next) => { // eslint-disable-line no-unused-vars
  ClientFeeder.user(req.params.langage)
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

cron.schedule('*/30 * * * *', () => {
  ClientFeeder.feed();
});
