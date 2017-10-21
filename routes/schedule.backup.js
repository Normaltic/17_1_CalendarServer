import express from 'express';
import Schedule from './models/scheduleModel';
import Account from './models/accountModel';
import Group from './models/groupModel';

const router = express.Router();

router.post('/create', (req, res) => {

	if( !req.body.title ) return res.json({ result: 0, error: 'EMPTY_TITLE'});
	if( req.body.is_shared && !req.body.users ) return res.json({ result: 0, error: 'NO_ADD_USERS'});

	req.body.registrant = req.decoded.ID;

	Schedule.createSchedule(req.body)
	.then(Account.findAndUpdateSchedule.bind(Account))
	.then( (result)  => {
		return res.json({
			result: 1,
		});
	})
	.catch( (err) => {
		console.log(err);
		return res.json({
			result: 0,
			error: err
		});
	});	
});

router.post('/update', (req, res) => {

	if( req.body.registrant != req.decoded.ID ) return res.json({result: 0, error: 'YOU_ARE_NOT_REGISTRANT'});

	Schedule.updateSchedule(req.body)
	.then( (result) => {
		return res.json({
			result: 1
		});
	})
	.catch( (err) => {
		console.log(err);
		return res.json({
			result: 0,
			error: err
		});
	});
});

router.get('/delete/:scheduleID', (req, res) => {

	Schedule.findOne(
		{ _id: req.params.scheduleID }
	).exec()
	.then( (sche) => {
		if( !sche ) return Promise.reject('SOMETHING_WRONG');
		if( sche.registrant != req.decoded.ID ) return Promise.reject('YOU_ARE_NOT_REGISTRANT');
		return Promise.resolve(sche);
	})
	.then(Account.findAndDeleteSchedule.bind(Account))
	.then( Schedule.deleteSchedule.bind(Schedule)(req.params.scheduleID))
	.then( (result) => {
		return res.json({
			result: 1
		});
	})
	.catch( (err) => {
		console.log(err);
		return res.json({
			result: 0,
			error: err
		});
	});
});

router.get('/getOptionSchedules/:include_shared', (req, res) => {

	Account.findOneByUserId(req.decoded.ID)
	.then( (user) => {
		if( !user ) return Promise.reject('NOT_EXIST_USER');
		if( req.params.include_shared == 'true' ) user.schedules.push( ...user.shared_schedule );
		return Promise.resolve(user.schedules);
	})
	.then(Schedule.findByidList.bind(Schedule))
	.then( (scheduleList) => {
		return res.json({
			result: 1,
			data: scheduleList
		});
	})
	.catch( (err) => {
		console.log(err);
		return res.json({
			result: 0,
			error: err
		});
	});
});

router.get('/getMonthSchedules/:include_shared/:year/:month', (req, res) => {

	const { include_shared, year, month } = req.params;

	Account.findOneByUserId(req.decoded.ID)
	.then( (user) => {
		if( !user ) return Promise.reject('NOT_EXIST_USER');
		if( include_shared == 'true' ) user.schedules.push( ...user.shared_schedule );
		return Promise.resolve(user.schedules);
	})
	.then( (schedules) => {
		 return Schedule.find({
				_id: { $in: schedules },
				date: { $gte: new Date(year,month-1,1) , $lte: new Date(year,month,1) }
			}).exec();
	}).then( (scheduleList) => {
		let obj = {};
		for( let sche of scheduleList ) {
			let key = year+'-'+month+'-'+sche.date.getDate();
			if( !obj[key] ) obj[key] = [sche];
			else obj[key].push(sche);
		}
		console.log(obj)
		return res.status(201).json({
			result: 1,
			data: obj
		});
	})
	.catch( (err) => {
		console.log(err);
		return res.json({
			result: 0,
			error: err
		});
	});
})

export default router;
