const User = require('../models/UserModel');
const { StatusCodes } = require('http-status-codes');
const {
	BadRequestError,
	UnauthenticatedError,
	ValidationError
} = require('../errors');
const { attachTokenCookie, createPayload } = require('../utils');
const { validationResult, matchedData } = require('express-validator');

const register = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new ValidationError(errors.errors[0].msg);
	}
	const { username, email, password } = matchedData(req);
	const user = await User.create({
		username,
		email,
		password,
		image: process.env.DEFAULT_IMAGE,
		imageID: process.env.DEFAULT_IMAGE_ID
	});
	const payload = createPayload(user);

	attachTokenCookie(res, payload);

	res.status(StatusCodes.CREATED).json({
		success: true,
		user: {
			email: user.email,
			username: user.username,
			image: user.image,
			createdAt: user.createdAt
		}
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password)
		throw new BadRequestError(
			'Provide an email and a password'
		);

	const user = await User.findOne({ email });

	if (!user) {
		throw new UnauthenticatedError(
			`User with ${email} does not exist`
		);
	}

	const IsCorrectPassword = await user.verifyPassword(password);

	if (!IsCorrectPassword) {
		throw new UnauthenticatedError('Invalid Password');
	}
	const payload = createPayload(user);

	attachTokenCookie(res, payload);

	res.status(StatusCodes.OK).json({
		success: true,
		user: {
			email: user.email,
			username: user.username,
			image: user.image,
			createdAt: user.createdAt
		}
	});
};

const logout = async (req, res) => {
	res.cookie('token', ' ', {
		httpOnly: true,
		expires: new Date(Date.now())
	});
	res.status(StatusCodes.OK).json({
		success: true,
		message: 'Logged Out'
	});
};
module.exports = {
	register,
	login,
	logout
};
