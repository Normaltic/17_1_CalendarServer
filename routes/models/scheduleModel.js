import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Schedule = new Schema({
	registrant: String,
	title: String,
	intro: { type: String, default: ""},
	place: { type: String, default: "미정"},
	date: Date,
	is_share: { type: Boolean, default: false},
	users: [String],
	groups: [String]
});

Schedule.statics.findByidList = function(list) {
	return this.find(
		{ _id: { $in: list } }
	).exec();
}

Schedule.statics.findByDate = function(data) {

	let { idList, year, month } = data;
	return this.find(
		{ 
			_id: { $in: idList },
			date: { $gte: new Date(year, month-1, 1) , $lte: new Date(year, month, 1) }
		}).exec();
}

Schedule.statics.createSchedule = function(info) {
	let sche = new this(info);
	return sche.save();
}

Schedule.statics.updateSchedule = function(sche) {
	return this.update(
		{ _id: sche._id },
		{ $set: sche }
	).exec();
}

Schedule.statics.deleteSchedule = function(scheid) {
	return this.remove(
		{ _id: scheid }
	).exec();
}


export default mongoose.model('schedule', Schedule);
