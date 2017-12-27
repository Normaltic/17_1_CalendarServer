import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Group = new Schema({
	name: String,
	description: { type: String, default: "No description" },
	master: String,
	members: { type: [String], default: [] },
	schedules: { type: [Schema.Types.ObjectId], default: [] },
	votes: { type: [Schema.Types.ObjectId], default: [] }
});

Group.statics.createGroup = function(data) {
	let group = new this(data);
	return group.save();
}

Group.statics.deleteGroup = function(grpID) {
	return this.remove({
		_id: grpID
	}).exec();
}

Group.statics.findByName = function(grpName) {
	return this.findOne({
		name: grpName
	}).exec();
}

Group.statics.findByNameList = function(list) {
	return this.find(
		{ name: { $in: list } }
	).exec();
}

Group.statics.findAndUpdateSchedule = function(sche) {

	return this.update(
		{ name: { $in: sche.groups } },
		{ $push: { schedules: sche._id } },
		{ multi: true }
	).exec();
}

Group.statics.findAndDeleteSchedule = function(sche) {

	return this.update(
		{ name: { $in: sche.groups } },
		{ $pull: { schedules: sche._id } },
		{ multi: true }
	).exec();
}

Group.statics.findAndUpdateVote = function(vte) {
	
	return this.update(
		{ name: { $in: vte.groups } },
		{ $push: { votes: vte._id } },
		{ multi: true }
	).exec();
}

Group.statics.findAndDeleteVote = function(vte) {

	return this.update(
		{ name: { $in: vte.groups } },
		{ $pull: { votes: vte._id } },
		{ multi: true }
	).exec();
}

export default mongoose.model('group', Group);
