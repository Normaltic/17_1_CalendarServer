var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var group = new Schema({
	name: String,
	admin: String,
	intro: { type: String, default: "" },
	memberlist: { type: [String], default: [] },
	schedules: { type: [Schema.Types.ObjectId], default: [] },
	votes: { type: [Schema.Types.ObjectId], default: [] }
});

module.exports = mongoose.model('group', group);
