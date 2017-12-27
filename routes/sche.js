import express from 'express';
import mongoose from 'mongoose';

import Schedule from './models/scheduleModel';
import Account from './models/accountModel';
import Group from './models/groupModel';

const router = express.Router();

router.post('/create', (req, res) => {

	if( !req.body.title ) return res.json({ result: 0, error: 'EMPTY_TITLE'});
	if( req.body.is_share && ( !req.body.users && !req.body.groups ) ) return res.json({ result: 0, error: 'NO_ADD_USERS'});

	req.body.registrant = req.decoded.ID;

	Schedule.createSchedule(req.body)
	.then( (schedule) => {
		if( schedule.groups.length ) return Group.findAndUpdateSchedule.bind(Group)(schedule);
		return Account.findAndUpdateSchedule.bind(Account)(schedule);
	})
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

router.post('/delete', (req, res) => {
	Schedule.findOne(
		{ 
			title: req.body.title,
			intro: req.body.intro,
			place: req.body.place,
			registrant: req.decoded.ID
		}
	)
	.then( (sche) => {
		console.log(sche);
		if( !sche ) return Promise.reject('SOMETHING_WRONG');
		if( sche.registrant != req.decoded.ID ) return Promise.reject('YOU_ARE_NOT_REGISTRANT');
		return Promise.resolve(sche);
	})
	.then( (sche) => {
		return Promise.all(
			[	
				Account.findAndDeleteSchedule.bind(Account)(sche),
				Group.findAndDeleteSchedule.bind(Group)(sche)
			]
		)
	})
	.then( (result) => {
		return Schedule.deleteSchedule.bind(Schedule)(req.body._id)
	})
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

router.post('/getMonthSchedules', (req, res) => {

	const { include_shared, year, month } = req.body;

	Promise.all(
		[
			Account.findOneByUserId.bind(Account)(req.decoded.ID),
			Group.findByNameList.bind(Group)(req.body.groupList)
		]
	)
	.then( (resolveData) => {
		if( !resolveData ) return Promise.reject('NOT_EXIST_USER');
		let scheduleList = resolveData[0].schedules;
		if( include_shared ) scheduleList.push(...resolveData[0].shared_schedule);

		for( let grp of resolveData[1] ) scheduleList.push(...grp.schedules);

		return Schedule.findByDate.bind(Schedule)({ idList: scheduleList, year: year, month: month });
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

router.post('/sendToServerAndroidRead', (req, res) => {
	console.log(req.body.str);
	res.end();
});

export default router;
