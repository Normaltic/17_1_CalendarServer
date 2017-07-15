var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var account = new Schema({
	ID: String,
	password: String,
	name: String,
	intro: { type: String, default: "" },
	schedules: { type: [Schema.Types.ObjectId], default: [] },
	shared_schedule: { type: [Schema.Types.ObjectId], default: [] },
	votes: { type: [Schema.Types.ObjectId], default: [] }
});

module.exports = mongoose.model('account', account);
