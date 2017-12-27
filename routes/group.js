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

router.get('/getGroupList', (req,res) => {

	Account.findOneByUserId(req.decoded.ID)
	.then( (user) => {
		if( user ) {
			return res.json({
				result: 1,
				groupList: user.groups
			});
		} else {
			return res.json({
				result: 0
			});
		}
	})
	.catch( (err) => {
		console.warn(err);
		return res.json({
			result: 0
		});
	});
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

router.get('/getGroupData/:groupName', (req, res) => {

	Group.findByName(req.params.groupName)
	.then( (grp) => {
		console.log(grp);
		if( !grp ) return Promise.reject('NOT_EXIST_GROUP');
		return Promise.resolve(grp);
	})
	.then( (grp) => {
		return res.json({
			result: 1,
			groupData: grp
		});
	})
	.catch( (err) => {
		return res.json({
			result: 0,
			error: err
		});
	});
});

router.post('/updateGroupData', (req, res) => {

	Group.findByName(req.body.name)
	.then( (grp) => {
		if( !grp ) return Promise.reject('NOT_EXIST_GROUP');
		if( req.decoded.ID != grp.master ) return Promise.reject('PERMISSION_DENIED');
		return Promise.resolve(grp);
	})
	.then( (grp) => {
		return Promise.all([
			Account.findAndDeleteGroup.bind(Account)(grp),
			Group.update(
				{ name: req.body.name },
				{
					members: req.body.members,
					description: req.body.description
				}
			)]);
	})
	.then( (result) => {
		return Account.findAndUpdateGroup.bind(Account)(req.body);
	})
	.then( (result) => {
		return Group.findByName.bind(Group)(req.body.name);
	})
	.then( (grp) => {
		return res.json({
			result: 1,
			groupData: grp
		});
	})
	.catch( (err) => {
		return res.json({
			result: 0,
			error: err
		});
	})
})

router.post('/delete', (req,res) => {
	
	Group.findByName(req.body.name)
	.then( (grp) => {
		console.log(grp);
		if( !grp ) return Promise.reject('NOT_EXIST_GROUP');
		if( req.decoded.ID != grp.master ) return Promise.reject('PERMISSION_DENIED');
		return Promise.resolve(grp);
	})
	.then( (grp) => {
		return Account.findAndDeleteGroup.bind(Account)(grp);
	})
	.then( (result) => {
		return Group.remove({ name: req.body.name }).exec();
	})
	.then( (result) => {
		return res.json({
			result: 1,
			resultData: result
		});
	})
	.catch( (err) => {
		return res.json({
			result: 0,
			error: err
		});
	});
})

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
