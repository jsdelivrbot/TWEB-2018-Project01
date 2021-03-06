const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
	username: String,
	id_github: Number,
	profile_url: String,
	name: String,
	company: String,
	blog: String,
	location: String,
	canton: String,
	city: String,
	bio: String,
	hireable: Boolean,
	languages: [String],
	email: String,
	created: { 
		type: Date,
		default: Date.now
	}
});

UserSchema.query.byUsername = function(username) {
	return this.where({ username: new RegExp(username, "i") });
};

UserSchema.query.byLangage = function(langage) {
	return this.where({ langages: langage});
};

// Export the model
module.exports = mongoose.model("User", UserSchema);