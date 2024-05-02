const path = require('path');
const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');
const { StatusCodes } = require('http-status-codes');
const { validationResult, matchedData } = require('express-validator');

const User = require('../models/UserModel');
const { createPayload, attachTokenCookie } = require('../utils');
const {
	UnauthenticatedError,
	BadRequestError,
	NotFoundError,
	CustomAPIError,
	ValidationError
} = require('../errors');

//Show Profile
const showProfile = async (req, res) => {
	const { userId } = req.user;
	if (!userId) throw new UnauthenticatedError('Authenticated Invalid');

	const user = await User.findOne({ _id: userId });
	if (!user) throw new NotFoundError('No such user exists');

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

const uploadPfp = async (req, res, next) => {
	const { userId } = req.user;
	if (!userId) throw new UnauthenticatedError('Authentication Invalid');

	const user = await User.findById(userId);
	if (!user) throw new NotFoundError('No such user exists');

	if (!req.files && !req.files.image) {
		throw new BadRequestError('Please upload an image');
	}

	const image = req.files.image;
	if (!image.mimetype.startsWith('image'))
		throw new ValidationError('Please upload an image');

	if (image.size > 5 * 1024 * 1024) {
		throw new CustomAPIError(
			'Please upload image smaller than 5MB',
			StatusCodes.REQUEST_TOO_LONG
		);
	}

	// Upload image to cloudinary
	const result = await cloudinary.uploader.upload(image.tempFilePath, {
		use_filename: true,
		folder: 'ExpenzzaV2'
	});
	if (!result) {
		throw new CustomAPIError(
			'Something went wrong in uploading the image',
			StatusCodes.INTERNAL_SERVER_ERROR
		);
	}

	user.image = result.secure_url;
	user.imageID = result.public_id;

	await user.save();

	const payload = createPayload(user);
	attachTokenCookie(res, payload);

	fs.unlinkSync(image.tempFilePath);

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

//Update Email
const updateEmail = async (req, res) => {
	const { userId } = req.user;
	if (!userId) throw new UnauthenticatedError('Authentication Invalid');

	const user = await User.findById(userId);
	if (!user) throw new NotFoundError('No such user exists');

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new ValidationError(errors.errors[0].msg);
	}

	const { email } = matchedData(req);
	user.email = email;

	await user.save();

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

//Update Password
const updatePassword = async (req, res) => {
	const { userId } = req.user;
	if (!userId) throw new UnauthenticatedError('Authentication Invalid');

	const user = await User.findById(userId);
	if (!user) throw new NotFoundError('No such user exists');

	const { oldpassword } = req.body;
	if (!oldpassword)
		throw new BadRequestError(
			'Please provide current password'
		);

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new ValidationError(errors.errors[0].msg);
	}

	const { password } = matchedData(req);

	const isCorrectPassword = await user.verifyPassword(oldpassword);
	if (!isCorrectPassword)
		throw new UnauthenticatedError('Invalid current password');

	user.password = password;
	await user.save();

	res.status(StatusCodes.OK).json({
		success: true,
		message: 'Password updated'
	});
};

//Update Username
const updateUsername = async (req, res) => {
	const { userId } = req.user;
	if (!userId) throw new UnauthenticatedError('Authentication Invalid');

	const user = await User.findById(userId);
	if (!user) throw new NotFoundError('No such user exists');

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new ValidationError(errors.errors[0].msg);
	}

	const { username } = matchedData(req);
	user.username = username;

	await user.save();

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

// Delete Image
const removeImage = async (req, res) => {
	const { userId } = req.user;
	if (!userId) throw new UnauthenticatedError('Authentication Invalid');

	const user = await User.findById(userId);
	if (!user) throw new NotFoundError('No such user exists');

	const result = await cloudinary.uploader.destroy(user.imageID);
	if (!result) {
		throw new CustomAPIError(
			'Something went wrong in uploading the image',
			StatusCodes.INTERNAL_SERVER_ERROR
		);
	}

	user.image = process.env.DEFAULT_IMAGE;
	user.imageID = process.env.DEFAULT_IMAGE_ID;

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

//Delete Account
const deleteAccount = async (req, res) => {
	const { userId } = req.user;
	if (!userId) throw new UnauthenticatedError('Authentication Invalid');

	const user = await User.findOne({ _id: userId });
	if (!user) throw new NotFoundError('No such user exists');

	if (!(user.imageID === process.env.DEFAULT_IMAGE_ID)) {
		const result = await cloudinary.uploader.destroy(
			user.imageID
		);
		if (!result) {
			throw new CustomAPIError(
				'Something went wrong in uploading the image',
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
	await user.deleteOne();
	res.cookie('token', ' ', {
		httpOnly: true,
		expires: new Date(Date.now())
	});

	res.status(StatusCodes.OK).json({
		success: true,
		message: `Account Deleted`
	});
};

module.exports = {
	showProfile,
	uploadPfp,
	updateEmail,
	updatePassword,
	updateUsername,
	deleteAccount,
	removeImage
};

// if (!req.files) throw new BadRequestError('No image uploaded');

// const userImage = req.files.image;
// if (!userImage.mimetype.startsWith('image'))
// 	throw new BadRequestError('Please upload an image');

// const maxSize = 5 * 1024 * 1024;
// if (userImage.size > maxSize)
// 	throw new BadRequestError(
// 		'Please upload image smaller than 5MB'
// 	);
// const imagePath = path.join(
// 	__dirname,
// 	`../public/uploads/${userImage.name}`
// );
// await userImage.mv(imagePath);
// return res
// 	.status(StatusCodes.OK)
// 	.json({ image: `/uploads/${userImage.name}` });
