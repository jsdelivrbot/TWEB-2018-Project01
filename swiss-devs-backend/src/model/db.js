// Set up mongoose connection
var mongoose = require('mongoose');

var dev_db_url = "mongodb://" + process.env.MONGO_USER + ':' + process.env.MONGO_PASS +  "@ds115353.mlab.com:15353/" + process.env.MONGO_DB;
var mongoDB = process.env.MONGODB_URI || dev_db_url;

mongoose.connect(mongoDB, { useNewUrlParser: true } );
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

console.log("MongoDB: OK");
