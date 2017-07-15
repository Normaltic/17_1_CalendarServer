
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schedule = new Schema({
	registrant: String,
	title: String,
	intro: { type: String, default: "" },
	place: { type: String, default: "미정" },
	date: Date,
	is_share: { type: Boolean, default: false },
	users: [String]
})

module.exports = mongoose.model('schedule', schedule);
