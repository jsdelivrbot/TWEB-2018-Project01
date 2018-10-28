const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const Feeder = require("./src/controllers/feeder");
const UserService = require("./src/controllers/user");

// Load dotenv
require("dotenv").config();

// Setup express
const app = express();
const port = process.env.PORT || 3000;

// Set up mongoose connection
var mongoose = require("mongoose");
var dev_db_url = "mongodb://" + process.env.MONGO_USER + ":" + process.env.MONGO_PASS +  "@ds115353.mlab.com:15353/" + process.env.MONGO_DB;
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true } );
mongoose.Promise = global.Promise;
mongoose.set("debug", true);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const ClientFeeder = new Feeder({ token: process.env.GITHUB_TOKEN });

// Enable CORS for the client app
app.use(cors());


// Get number of users per canton
function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
}

// Get the users count per canton
app.get("/users/canton/count", (req, res, next) => { // eslint-disable-line no-unused-vars
	var charts_keys = { "ch-ag": "Aargau", "ch-ai": "Appenzell Inner Rhoden", "ch-ar": "Appenzell Outer Rhoden", "ch-be": "Berne", "ch-bs": "Basle-Country", "ch-3306": "Basle-City", "ch-fr": "Fribourg", "ch-ge": "Geneva", "ch-gl": "Glaris", "ch-gr": "Grisons", "ch-ju": "Jura'", "ch-lu": "ucerne", "ch-ne": "Neuchatel", "ch-nw": "Nidwalden", "ch-7": "Obwalden", "ch-sg": "St. Gall", "ch-sh": "Schaffhausen", "ch-so": "Solothurn", "ch-sz": "Schwyz", "ch-tg": "Thurgau", "ch-ti": "Ticino", "ch-ur": "Uri", "ch-vd": "Vaud", "ch-vs": "Valais", "ch-zg": "Zug", "ch-zh": "Zurich" };
	var count_per_canton = { "ch-ag": 0, "ch-ai": 0, "ch-ar": 0, "ch-be": 0, "ch-bs": 0, "ch-3306": 0, "ch-fr": 0, "ch-ge": 0, "ch-gl": 0, "ch-gr": 0, "ch-ju": 0, "ch-lu": 0, "ch-ne": 0, "ch-nw": 0, "ch-7": 0, "ch-sg": 0, "ch-sh": 0, "ch-so": 0, "ch-sz": 0, "ch-tg": 0, "ch-ti": 0, "ch-ur": 0, "ch-vd": 0, "ch-vs": 0, "ch-zg": 0, "ch-zh": 0 };

	UserService.users_count_per_canton_test().then(aggregate => {
		for (var idx in aggregate) {
			count_per_canton[getKeyByValue(charts_keys, aggregate[idx]._id)] = aggregate[idx].count;
		}
		res.json(count_per_canton);
	});
});

// Get users by canton
app.get("/users/canton/:canton", (req, res, next) => { // eslint-disable-line no-unused-vars
	UserService.users_canton(req.params.canton)
		.then(user => res.send(user))
		.catch(next);
});

// Get user by canton and language
app.get("/users/canton/:canton/language/:language", (req, res, next) => { // eslint-disable-line no-unused-vars
	UserService.users_canton_and_language(req.params.canton, req.params.language, res)
		.then(user => res.send(user))
		.catch(next);
});



// Get users by languages
app.get("/users/language/:language", (req, res, next) => { // eslint-disable-line no-unused-vars
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
app.get("/feed/", (req, res, next) => { // eslint-disable-line no-unused-vars
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
cron.schedule("* */5 * * *", () => {
	ClientFeeder.feed();
});

module.exports = app; // for testing
