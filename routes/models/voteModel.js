import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Vote = new Schema({
	registrant: String,
	title: String,
	intro: { type: String, default: "" },
	place: { type: String, default: "미정" },
	date: Date,
	is_share: { type: Boolean, default: true },
	users: { type: [String], default: [] },
	groups: { type: [String], default: [] },
	yes: { type: [String], default: [] },
	no: { type: [String], default: [] },
	commentWriter: { type: [String], default: [] },
	commentContent: { type: [String], default: [] },
	comment: { type: [ {writer: String, comment: String} ], default: [] }
});

Vote.statics.findOneById = function(vteID) {
	return this.findOne(
		{ _id: new mongoose.Types.ObjectId(vteID) }
	).exec();
}

Vote.statics.findByidList = function(list) {
	return this.find(
		{ _id: { $in: list } }
	).exec();
}

Vote.statics.createVote = function(info) {
	let vte = new this(info);
	return vte.save();
}

Vote.statics.updateVote = function(vte) {
	return this.update(
		{ _id: vte._id },
		{ $set: vte }
	).exec();
}

Vote.statics.deleteVote = function(vteid) {
	return this.remove(
		{ _id: vteid }
	).exec();
}

export default mongoose.model('vote', Vote);
