const jwt = require('jsonwebtoken');

const createToken = function (payload) {
	const token = jwt.sign(payload, process.env.PRIVATEKEY, {
		expiresIn: process.env.TOKENLIFETIME || '30d'
	});
	return token;
};

const attachTokenCookie = function (res, payload) {
	const token = createToken(payload);
	const oneDay = 1000 * 60 * 60 * 24;
	res.cookie('token', token, {
		httpOnly: true,
		expires: new Date(Date.now() + oneDay),
		signed: true
	});
};

const verifyToken = function (token) {
	return jwt.verify(token, process.env.PRIVATEKEY, (err, payload) => {
		if (err)
			throw new UnauthenticatedError(
				'Authentication Invalid'
			);
		return payload;
	});
};
module.exports = { createToken, attachTokenCookie, verifyToken };
