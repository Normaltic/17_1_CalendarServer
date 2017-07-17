import express from 'express';
import Vote from './models/voteModel';
import Schedule from './models/scheduleModel';
import Account from './models/accountModel';

const router = express.Router();

router.post('/create', (req, res) => {

	if( !req.body.title ) return res.json({ result: 0, error: 'EMPTY_TITLE' });
	if( req.body.is_share && !req.body.users ) return res.json({ result: 0, error: 'NO_ADD_USERS' });

	req.body.registrant = req.decoded.ID;

	Vote.createVote(req.body)
	.then(Account.findAndUpdateVote.bind(Account))
	.then( (result) => {
		return res.json({
			result: 1
		});
	}).catch( (err) => {
		console.log(err);
		return res.json({
			result: 0,
			error: err
		});
	});
})

router.post('/update', (req, res) => {

	if( req.body.registrant != req.decoded.ID ) return res.json({ result: 0, error: 'YOU_ARE_NOT_REGISTRANT' });

	Vote.updateVote(req.body)
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
	});
})

router.get('/delete/:voteID', (req, res) => {

	Vote.findOne(
		{ _id: req.params.voteID }
	).exec()
	.then( (vte) => {
		if( !vte ) return Promise.reject('SOMETHING_WRONG');
		if( vte.registrant != req.decoded.ID ) return Promise.reject('YOU_ARE_NOT_REGISTRANT');
		return Promise.resolve(vte);
	})
	.then(Account.findAndDeleteVote.bind(Account))
	.then(Vote.deleteVote.bind(Vote)(req.params.voteID))
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
})

router.get('/getVoteList', (req, res) => {

	Account.findOneByUserId(req.decoded.ID)
	.then( (user) => {
		if( !user ) return Promise.reject('NOT_EXIST_USER');
		return Promise.resolve(user.votes);
	})
	.then(Vote.findByidList.bind(Vote))
	.then( (voteList) => {
		return res.json({
			result: 1,
			voteList: voteList
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

router.get('/getVoteData/:voteID', (req, res) => {
	
	Vote.findOne( { _id: req.params.voteID } ).exec()
	.then( (vte) => {
		if( !vte ) {
			return res.json({
				result: 0,
				error: 'SOMETHING_WRONG'
			});
		} else {
			return res.json({
				result: 1,
				voteData: vte
			});
		}
	});
})

router.post('/vote', (req, res) => {

	Vote.findOne({ _id: req.body._id }).exec()
	.then( (vte) => {
		if( vte.yes.length && ( vte.yes.indexOf(req.decoded.ID) != -1 ) )
			vte.yes.splice(vte.yes.indexOf(req.decoded.ID), 1);
		else if( vte.no.length && ( vte.no.indexOf(req.decoded.ID) != -1 ) )
			vte.no.splice(vte.no.indexOf(req.decoded.ID), 1);

		if( req.body.is_yes ) 
			vte.yes.push(req.decoded.ID);
		else
			vte.no.push(req.decoded.ID);
		return vte.save();
	})
	.then( (vte) => {
		return res.json({
			result: 1,
			voteData: vte
		});
	})
	.catch( (err) => {
		return res.json({
			result: 0,
			error: err
		});
	});

})

router.post('/updateComment', (req, res) => {

	/*Vote.findOne({ _id: req.body._id }).exec()
	.then( (vte) => {
		vte.commentWriter.push(req.decoded.ID);
		vte.commentContent.push(req.body.commentContent);
		return vte.save();
	}).then( (result) => {
		return Vote.findOne({ _id: req.body._id }).exec();
	}).then( (vte) => {
		return res.json({
			result: 1,
			voteData: vte
		});
	}).catch( (err) => {
		return res.json({
			result: 0,
			error: err
		});
	});*/

	Vote.findOne({ _id: req.body._id }).exec()
	.then( (vte) => {
		let comment = { writer: req.decoded.ID, comment: req.body.comment };
		vte.comment.push(comment);
		return vte.save();
	})
	.then( (result) => {
		res.json({
			result: 1,
			voteData: result
		});
	})
	.catch( (err) => {
		return res.json({
			result: 0,
			error: err
		});
	});
})

router.post('/ChangeSchedule', (req, res) => {

	if( req.body.registrant != req.decoded.ID ) return res.json({ result: 0, error: 'YOU_ARE_NOT_REGISTRANT' });

	Schedule.createSchedule(req.body)
	.then(Account.findAndUpdateSchedule.bind(Account)) 
	.then(Account.findAndDeleteVote.bind(Account)(req.body))
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
	});
})

export default router;
