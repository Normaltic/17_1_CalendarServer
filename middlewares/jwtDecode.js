import jwt from 'jsonwebtoken';

const JWTdecode = (req, res, next) => {

	const token = req.headers['calendar-token'];

	if( !token ) {
		return res.status(403).json({
			result: 0,
			error: 'NOT_HAVE_TOKEN'
		});
	}

	const p = new Promise( (resolve, reject) => {

		jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
			if( err ) reject(err);
			resolve(decoded);
		});
	});

	p.then( (decoded) => {
		req.decoded = decoded;
		next();
	}).catch( (err) => {
		if( err.message === "invalid token" ) {
			return res.status(403).json({
				result: 0,
				error: 'INVALID_TOKEN'
			});
		} else {
			return res.status(403).json({
				result: 0,
				error: err.message
			});
		}
	});
}

export default JWTdecode;
