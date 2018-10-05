const express = require('express');
const cors = require('cors');
const Github = require('./src/Github');

// Load dotenv
require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;

// MongoDB
const MongoClient = require('mongodb').MongoClient
const MongoURL = "mongodb://" + process.env.MONGO_USER + ':' + process.env.MONGO_PASS +  "@ds115353.mlab.com:15353/" + process.env.MONGO_DB;
const DataModel = require('./src/Github')

var db;
MongoClient.connect(MongoURL, { useNewUrlParser: true }, (err, mongoClient) => {
  // ... start the server
  if (err) return console.log(err)
  db = mongoClient.db('star-wars-quotes') // whatever your database name is

  console.log("Connected to the MongoDB database ...");
  db.collection('users').find();
  const client = new Github({ token: process.env.GITHUB_TOKEN, db });

  // Enable CORS for the client app
  app.use(cors());

  /**
   * - getUsers() : Return all Switzerlands developers
   * - getUsers(var canton) : Return all Switzerlands developers from one specific canton
   */
  app.get('/users/:canton', (req, res, next) => { // eslint-disable-line no-unused-vars
    client.user(req.params.canton)
      .then(user => res.send(user))
      .catch(next);
  });

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening at http://localhost:${port}`);
  });


  // Feeding the databases
  app.get('/feed/', (req, res, next) => { // eslint-disable-line no-unused-vars
    client.fetchUsers("Vaud")
    .then(function(data) {
      console.log(data.total_count);
      res.send("Total count: " + data.total_count);
    })
    .catch(next);
  });
})

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(err.status || 500);
  res.send(err.message);
});


