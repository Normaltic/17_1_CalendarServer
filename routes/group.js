import express from 'express';
import Group from './models/groupModel';
import Account from './models/accountModel';
import Schedule from './models/scheduleModel';

const router = express.Router();

router.post('/create', (req, res) => {

	if( !req.body.name ) return res.json({ result: 0, error: 'EMPTY_NAME' });
	
	req.body.master = req.decoded.ID;

	Group.findByName(req.body.name)
	.then( (result) => {
		if( result ) return Promise.reject('GROUP_NAME_ALREADY_EXIST');
		return Group.createGroup.bind(Group)(req.body);
	})
	.then( (group) => {
		console.log(group);
		console.log("만들어졌당!");
		return Account.findAndUpdateGroup.bind(Account)(group);
	})
	.then( (result) => {
		return res.json({
			result: 1
		});
	})
	.catch( (err) => {
		return res.json({
			result: 0,
			error: err
		});
	})
});

router.post('/getMonthSchedules', (req, res) => {
	
	let { groupName, year, month, } = req.body;

	Group.findByName(groupName)
	.then( (grp) => {
		return Schedule.findByDate.bind(Schedule)({ idList: grp.schedules, year: year, month: month });
	})
	.then( (scheduleData) => {
		let obj = {};
		for( let sche of scheduleData ) {
			let key = `${year}-${month}-${sche.date.getDate()}`;
			if( !obj[key] ) obj[key] = [sche];
			else obj[key].push(sche)
		}
		console.log(obj);
		return res.json({
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


router.post('/delete', (req,res) => {

	if( req.decoded.ID != req.body.master ) return res.json({ result: 0, error: 'YOU_ARE_NOT_MASTER' });
	
	return res.json({result: 0, error: 'asd'});
});

router.get('/find/:_id', (req, res) => {

	Group.findOne({_id: req.params._id}).exec()
	.then( (result) => {
		return res.json({
			result: 1,
			data: result
		});
	})
	.catch( (err) => {
		return res.json({
			result: 0,
			error: err
		});
	})
});

export default router;
