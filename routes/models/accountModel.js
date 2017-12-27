import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const Account = new Schema({
	ID: String,
	password: String,
	name: String,
	intro: { type: String, default: ""},
	schedules: { type: [Schema.Types.ObjectId], default: [] },
	shared_schedule: { type: [Schema.Types.ObjectId], default: [] },
	votes: { type: [Schema.Types.ObjectId], default: [] },
	groups: { type: [String], default: [] }
});

//method
Account.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, 10);
}

Account.methods.checkHash = function(password) {
	return bcrypt.compareSync(password, this.password);
}

//static method
Account.statics.createAccount = function(info) {
	let acc = new this(info);
	acc.password = bcrypt.hashSync(acc.password, 10);
	return acc.save();
};

Account.statics.findOneByUserId = function(userID) {
	return this.findOne({
		ID: userID
	}).exec();
};

Account.statics.findAndUpdateSchedule = function(sche) {

	if( sche.is_share ) {
		sche.users.push(sche.registrant);
		return this.update(
			{ ID: { $in: sche.users } },
			{ $push: { shared_schedule: sche._id } },
			{ multi: true }
		).exec();
	} else {
		return this.update(
			{ ID: sche.registrant },
			{ $push: { schedules: sche._id } }
		).exec();
	}
}

Account.statics.findAndDeleteSchedule = function(sche) {
	if( sche.is_share ) {
		sche.users.push(sche.registrant);
		return this.update(
			{ ID: { $in: sche.users } },
			{ $pull: { shared_schedule: sche._id } },
			{ multi: true }
		).exec();
	} else {
		return this.update(
			{ ID: sche.registrant },
			{ $pull: { schedules: sche._id } }
		).exec();
	}
}

Account.statics.findAndUpdateVote = function(vte) {
	vte.users.push(vte.registrant);
	return this.update(
		{ ID: { $in: vte.users } },
		{ $push: { votes: vte._id } },
		{ multi: true }
	).exec();
}

Account.statics.findAndDeleteVote = function(vte) {
	vte.users.push(vte.registrant);
	return this.update(
		{ ID: { $in: vte.users } },
		{ $pull: { votes: vte._id } },
		{ multi: true }
	).exec();
}

Account.statics.findAndUpdateGroup = function(grp) {
	grp.members.push(grp.master);
	return this.update(
		{ ID: { $in: grp.members } },
		{ $push: { groups: grp.name } },
		{ multi: true }
	).exec();
}

Account.statics.findAndDeleteGroup = function(grp) {
	grp.members.push(grp.master);
	return this.update(
		{ ID: { $in: grp.members } },
		{ $pull: { groups: grp.name } },
		{ multi: true }
	).exec();
}

export default mongoose.model('account', Account);
