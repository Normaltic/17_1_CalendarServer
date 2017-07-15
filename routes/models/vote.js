
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var vote = new Schema({
	registrant: String,
	title: String,
	intro: { type: String, default: "" },
	place: { type: String, default: "미정" },
	date: Date,
	is_share: { type: Boolean, default: true },
	users: { type: [String], default: [] } ,
	yes: { type: [String], default: [] },
	no: { type: [String], default: [] },
	commentWriter: { type: [String], default: [] },
	commentContent: { type: [String], default: [] }
});

module.exports = mongoose.model('vote', vote);
