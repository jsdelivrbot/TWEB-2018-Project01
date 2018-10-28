const chai = require("chai");
chai.use(require("chai-shallow-deep-equal"));

const User = require("../src/model/user");
const UserService = require("../src/controllers/user");

const { expect } = chai;


// Load dotenv
require("dotenv").config();

// Set up mongoose connection
var mongoose = require("mongoose");
var dev_db_url = "mongodb://" + process.env.MONGO_USER + ":" + process.env.MONGO_PASS +  "@ds115353.mlab.com:15353/" + process.env.MONGO_DB;
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true } );
mongoose.Promise = global.Promise;
mongoose.set("debug", true);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));


var default_user = new User({
	_id: new mongoose.mongo.ObjectId(),
	username: "Mocha-test",
	name: "Mocha-test",
	company: "Mocha-test",
	email: "mentor.reka@heig-vd.ch",
	canton: "Vaud",
	languages: ["JavaScript", "HTML"]
});

// Tests the interaction with databases for basics functions
describe("DatabaseUsers", function() {
	this.timeout(50000);

	// Create data before tests
	this.beforeAll(function() {
		User.create({
			_id: new mongoose.mongo.ObjectId(),
			username: "Mocha-test",
			name: "Mocha-test",
			company: "Mocha-test",
			email: "mentor.reka@heig-vd.ch",
			canton: "Vaud",
			languages: ["JavaScript", "HTML"]
		});
	});

	// Remove tests datas after all tests
	this.afterAll(function() {
		User.remove({username: "Mocha-test"});
	});

	describe("#save()", function() {
		it("should save without error", function(done) {
			default_user.save(done);
		});
	});

	describe("#remove()", function() {
		it("should remove without error", function(done) {
			User.deleteOne({email: "mentor.reka@heig-vd.ch"}, function(err, doc) {
				if (err) throw err;
				else {
					done();
				}
			});
		});
	});

	describe("#findByCantonAndEmail()", function() {
		it("should return the user \"mentor.reka@heig-vd.ch\"", function(done) {
			User.find({canton: "Vaud", email: "mentor.reka@heig-vd.ch" }, function(err, doc) {
				if (err) throw err;
				if (doc.length) {
					done();
				} else {
					throw new Error("No record in database");
				}
			});
		});
	});

	describe("#findByEmail()", function() {
		it("should return an error", function(done) {
			default_user.save();
			User.deleteOne({email: "mentor.reka@heig-vd.ch"}).then(() => {
				expect(
					function() {
						User.find({email: "mentor.reka@heig-vd.ch"}, function(err, doc) {
							if (err) throw err;
							else {
								if (!doc.length) {
									throw err;
								}
							}
						});
					}
				).to.throw(done);
			}).catch((err) => { throw err; });
		});
	});

    
});