var Account = require('./models/account');
var Schedule = require('./models/schedule');
var Vote = require('./models/vote');


module.exports = function(app) {

	//Create ID
	app.post('/data/account/signin', function(req, res) {

		if( !req.body.ID ) return res.json({result: 0, error: 'EMPTY_ID'});
		if( !req.body.password ) return res.json({result: 0, error: 'EMPTY_PASSWORD'});
		if( !req.body.name ) return res.json({result: 0, error: 'EMPTY_NAME'});

		Account.findOne({ID: req.body.ID}, function(err, acc) {
			if( err ) return res.json({result: 0, error: err});
			if( acc ) return res.json({result: 0, error: 'USED_ID'});

			let account = new Account();
			account.ID = req.body.ID;
			account.password = req.body.password;
			account.name = req.body.name;
			if( req.body.intro ) account.intro = req.body.intro;

			account.save( function(err) {
				if(err) {
					console.error(err);
					return res.json({result: 0, error: err});
				}
				console.log(account);
				return res.json({result: 1});
			});
		});
	});

	//Check Exist ID
	app.get('/data/account/checkID/:ID', function(req, res) {

		if( !req.params.ID ) return res.json({result: 0, error: 'EMPTY_ID'});

		Account.findOne({ID: req.params.ID}, function(err, acc) {
			if( err ) return res.json({result: 0, error: err});
			if( !acc ) return res.json({result: 0, error: 'NOT_EXIST_USER'});

			return res.json({result: 1});
		});
	});
 	
	//Login
	app.post('/data/account/signup', function(req, res) {

		if( !req.body.ID ) return res.json({result: 0, error: 'EMPTY_ID'});
		if( !req.body.password ) return res.json({result: 0, error: 'EMPTY_PASSWORD'});

		Account.findOne({ID: req.body.ID}, function(err, acc) {
			if( err ) return res.json({result: 0, error: err});
			if( !acc ) return res.json({result: 0, error: 'NOT_EXIST_ACCOUNT'});
			if( acc.password != req.body.password ) return res.json({result: 0, error: 'INCORRECT_PASSWORD'});

			res.json({result: 1, data: acc});
		});
	});
	
	//create Sechedule
	app.post('/data/schedule/create', function(req, res) {
		if( !req.body.title ) return res.json({result: 0, error: 'EMPTY_TITLE'});
		
		let error;
		let schedule = new Schedule();
		schedule.title = req.body.title;
		schedule.date = req.body.date;
		schedule.registrant = req.body.registrant;
		if( req.body.intro ) schedule.intro = req.body.intro;
		if( req.body.place ) schedule.place = req.body.place;
		
		if( req.body.is_share ) {
			if( !req.body.users ) return res.json({result: 0, error: 'NO_ADD_USERS'});

			schedule.is_share = req.body.is_share;
			schedule.users = req.body.users;
		}

		schedule.save( function(err) {
			if( err ) return error = err;
			console.log(schedule._id);

			if( schedule.is_share ) {
				Account.update( { ID: { $in: schedule.users } },
					{ $push: { shared_schedule: schedule._id } },
					{ multi: true },
					function(err, acc) { console.log("users_shared_schedule_fine"); } );

				Account.update( { ID: schedule.registrant },
					{ $push: { shared_schedule: schedule._id } },
					function(err, acc) { console.log("registrant_shared_schedule_fine"); } );
				
			} else {
				Account.update( { ID: schedule.registrant },
						{ $push: { schedules: schedule._id } },
						function(err, acc) { console.log("registrant_schedules_fine"); } );
			}

			console.log(schedule);
			return res.json({result: 1, data: schedule});
		});

		if( error ) return res.json({result: 0, error: error});
	});

	//update Schedule
	app.post('/data/schedule/update', function(req, res) {

		Schedule.update( { _id: req.body._id }, { $set: req.body }, function(err, sche) {
			if( err ) return res.json({result: 0, error: err});
			if( !sche ) return res.json({result: 0, error: 'SOMETHING_WRONG_ID'});

			return res.json({result: 1, data: sche});
		});
	});

	//create Vote Schedule
	app.post('/data/vote/create', function(req, res) {
		if( !req.body.title ) return res.json({result: 0, error: 'EMPTY_TITLE'});
		if( !req.body.users.length ) return res.json({result: 0, error: 'NO_ADD_USERS'});

		var error;
		var vote = new Vote();
		vote.title = req.body.title;
		vote.date = req.body.date;
		vote.registrant = req.body.registrant;
		vote.users = req.body.users;
		if( req.body.intro ) vote.intro = req.body.intro;
		if( req.body.place ) vote.place = req.body.place;

		vote.save( function(err) {
			if( err ) return error = err;

			Account.update( { ID: { $in: vote.users } },
				{ $push: { votes: vote._id } },
				{ multi: true },
				function(err, acc) { console.log("users have a vote"); } );

			Account.update( { ID: vote.registrant },
				{ $push: { votes: vote._id } },
				function(err, acc) { console.log("registrant have a vote"); } )

			return res.json({result: 1, data: vote});
		});

		if( error ) return res.json({result: 0, error: error});
	});

	//update Vote
	app.post('/data/vote/update', function(req, res) {
		
		Vote.update( { _id: req.body._id }, { $set: req.body }, function(err, vte) {
			if( err ) return res.json({result: 0, error: err});
			if( !vte ) return res.json({result: 0, error: 'SOMETHING_WRONG_ID'});
			console.log(vte);
			
			return res.json({result: 1})
		});
	});

	//delete Vote
	app.post('/data/vote/delete', function(req, res) {

		Vote.findOne( { _id: req.body._id }, function(err, vte) {
			if( err ) return res.json({result: 0, error: err});
			if( !vte ) return res.json({result: 0, error: err});

			Account.update( { ID: { $in: vte.users } },
			   	{ $pull : { votes: req.body._id } },
				{ multi: true },
			   	function(err, acc) { console.log("now users don't have a vote"); } );

			Account.update( { ID: vte.registrant }, 
				{ $pull : { votes: req.body._id } },
				{ multi: true },
				function(err, acc) { console.log("now registrant don't habe a vote"); } );

			Vote.remove( { _id: req.body._id }, function(err, vte) {
				if( err ) return res.json({result: 0, error: err});
				return res.json({result: 1});
			});
		});
	});

	//get Vote Lists
	app.post('/data/vote/getVoteList', function(req, res) {

		console.log( req.body.ID );

		Account.findOne( { ID: req.body.ID }, function(err, acc) {
			if( err ) return res.json({result: 0, error: err});

			Vote.find( { _id: { $in: arr.votes } }, function(err, vts) {
				if( err ) return res.json({result: 0, error: err});
				console.log(vts);
				return res.json({result: 1, data: vts});
			});
		});
	});

	//get solo Vote data
	app.post('/data/vote/getdata', function(req, res) {

		Vote.findOne( { _id: req.body._id }, function(err, vte) {
			if( err ) return res.json({result: 0, error: err});
			if( !vte ) return res.json({result: 0, error: 'SOMETHING_WRONG'});
			console.log(vte);
			return res.json({result: 1, data: vte});
		});
	});

	//vite Vote Schedule
	app.post('/data/vote/vote', function(req, res) {

		Vote.findOne( { _id: req.body.voteid } , function(err, vte) {

			var error;
			if( err ) return res.json({result:0, error: err});

			if( vte.yes.length ) {
				if( vte.yes.indexOf(req.body.userID) != -1 ) vte.yes.splice(vte.yes.indexOf(req.body.userID), 1);
			}
			if( vte.no.length ) {
				if( vte.no.indexOf(req.body.userID) != -1 ) vte.no.splice(vte.no.indexOf(req.body.userID), 1);
			}

			if( req.body.is_yes ) {
				vte.yes.push(req.body.userID);
			} else vte.no.push(req.body.userID);

			vte.save( function(err) {
				if( err ) return res.json({ result: 0, error: err });
				return res.json({result: 1, data: vte});
			});
		});
	});

	//regist comment
	app.post('/data/vote/updateComment', function(req, res) {

		Vote.findOne( { _id: req.body.voteid }, function(err,vte) {

			var error;
			if( err) return res.json({result: 0, error: err});

			vte.commentWriter.push(req.body.userID);
			vte.commentContent.push(req.body.comment);

			vte.save( function(err) {
				if( err) return res.json({ result: 0, error: err});
				console.log(vte);
				return res.json({result: 1, data: vte});
			});
		});
	});
			

	// user schedule
	app.post('/data/schedule/getUserSchedule', function(req, res) {

		var error;

		Account.findOne( {ID: req.body.userID}, function(err, acc) {
			if( err ) return res.json({result: 0, error: err});
			if( !acc ) return res.json({result: 0, error: 'SOMETHING_WRONG_ABOUT_ACC'});

			Schedule.find( { _id: { $in: acc.schedules } }, function(err, sche) {
				if( err ) return error = err;
				return res.json({result: 1, sche: sche}); 
			});

			if( error ) return res.json({result: 0, error: error});	
		});
	});

	//user_shared_schedule
	app.post('/data/schedule/getUserSharedSchedule', function(req, res) {

		var error;

		Account.findOne( { ID : req.body.userID }, function(err, acc) {
			if( err ) return res.json({result: 0, error: err});
			if( !acc ) return res.json({result: 0, error: 'SOMETHING_WRONG_ABOUT_ACC'});
			console.log(acc);

			Schedule.find( { _id: { $in: acc.shared_schedule } }, function(err, sche) {
				if( err ) return error = err;
				return res.json({result: 1, sche: sche});
			});

			if( error ) return res.json({result: 0, error: error});

		});
	});
	

	//get user,share schedule
	app.post('/data/schedule/getOptionSchedules', function(req, res) {
		var scheduleID = [];

		Account.findOne({ID: req.body.ID}, function(err, acc) {
			if( err ) return res.json({result: 0, error: err});

			scheduleID.push(...acc.schedules);
			if( req.body.include_shared ) scheduleID.push(...acc.shared_schedule);

			Schedule.find({_id: {$in: scheduleID}}, function(err, sche) {
				if( err ) return res.json({result: 0, error: err});
				console.log(sche);
				return res.json({result: 1, data: sche});
			});
		});		
	});		
};
