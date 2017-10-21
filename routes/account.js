import express from 'express';
import Account from './models/accountModel';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/find/:id', (req, res) => {

	Account.findOneByUserId(req.params.id)
	.then( (user) => {
		if( user ) {
			return res.json({
				result: 1
			});
		} else {
			return res.json({
				result: 0
			});
		}
	})
});

router.post('/signup', (req, res) => {

	if( !req.body.ID ) return res.json({ result: 0, error: 'EMPTY_ID'});
	if( !req.body.password ) return res.json({ result: 0, error: 'EMPTY_PASSWORD'});
	if( !req.body.name ) return res.json({ result: 0, error: 'EMPTY_NAME'});

	Account.findOneByUserId(req.body.ID)
	.then( (user) => {
		if( user ) return Promise.reject('USED_ID');
		else return Promise.resolve(req.body);
	})
	.then(Account.createAccount.bind(Account))
	.then( (result) => {
		return res.json({result:1});
	})
	.catch( (err) => {
		console.log(err);
		return res.json({
			error: err,
			result: 0
		});
	});
});

router.post('/signin', (req, res) => {
	
	console.log(req.body);

	if( !req.body.ID ) return res.json({ result: 0, error: 'EMPTY_ID'});
	if( !req.body.password ) return res.json({ result: 0, error: 'EMPTY_PASSWORD'});

	const createToken = (user) => {
		return new Promise( (resolve, reject) => {
			jwt.sign(
			{
				_id: user._id,
				ID: user.ID
			},
			req.app.get('jwt-secret'),
			{
				expiresIn: '7d',
				issuer: 'NormalticToken',
				subject: 'userToken'
			}, (err, token) => {
				console.log("return Token");
				if( err ) reject(err);
				resolve({token, user});
			});
		});
	};

	Account.findOneByUserId(req.body.ID)
	.then( (user) => {
		if( !user ) return Promise.reject('NOT_EXIST_USER');
		if( !user.checkHash(req.body.password) ) return Promise.reject('INCORRECT_PASSWORD');
		else return Promise.resolve(user);
	})
	.then(createToken)
	.then( ({token,user}) => {
		return res.json({
			result: 1,
			token: token,
			userID: user.ID,
			groupList: user.groups
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
