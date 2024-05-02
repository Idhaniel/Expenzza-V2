const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

const Expense = require('../models/ExpenseModel');
const { checkIfEmpty } = require('../utils/sanitizeInput');
const pageLimitQuery = require('../utils/pageLimitQuery');

const {
	BadRequestError,
	NotFoundError,
	UnauthenticatedError,
	ValidationError
} = require('../errors');

const getAllExpenses = async (req, res) => {
	const { userId } = req.user;
	if (!userId) throw new UnauthenticatedError('Authentication Invalid');

	const totalCount = await Expense.countDocuments({
		createdBy: userId
	});

	const { page, numOfPages, limit } = pageLimitQuery(req, totalCount);

	const skip = (Number(page) - 1) * Number(limit);

	const expense = await Expense.find({ createdBy: userId })
		.sort('amount')
		.skip(skip)
		.limit(limit)
		.select('_id description amount category createdAt');

	res.status(StatusCodes.OK).json({
		success: true,
		expense,
		page,
		count: expense.length,
		totalCount,
		numOfPages
	});
};

const getSingleExpense = async (req, res) => {
	const { userId } = req.user;
	if (!userId) throw new UnauthenticatedError('Authentication Invalid');

	const expense = await Expense.findOne({
		createdBy: userId,
		_id: req.params.id
	});

	if (!expense)
		throw new NotFoundError(
			`No expense with id ${req.params.id}`
		);

	res.status(StatusCodes.OK).json({
		success: true,
		expense: {
			id: expense._id,
			description: expense.description,
			amount: expense.amount,
			category: expense.category,
			createdAt: expense.createdAt
		}
	});
};

const createExpense = async (req, res) => {
	const { userId } = req.user;
	if (!userId) throw new UnauthenticatedError('Authentication Invalid');

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new ValidationError(errors.errors[0].msg);
	}

	req.body.createdBy = userId;

	if (checkIfEmpty(req.body.category)) {
		req.body.category = 'miscellaneous';
	}

	const expense = await Expense.create(req.body);

	res.status(StatusCodes.CREATED).json({
		success: true,
		expense: {
			id: expense._id,
			description: expense.description,
			amount: expense.amount,
			category: expense.category,
			createdAt: expense.createdAt
		}
	});
};

const updateExpense = async (req, res) => {
	const {
		params: { id: expenseId },
		user: { userId }
	} = req;
	if (!userId) throw new UnauthenticatedError('Authentication Invalid');

	const expense = await Expense.findOne({
		createdBy: userId,
		_id: expenseId
	});
	if (!expense) {
		throw new BadRequestError(
			`No expense with id ${expenseId}`
		);
	}

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new ValidationError(errors.errors[0].msg);
	}

	// Update expense fields if provided
	const { description, category, amount } = req.body;

	if (description !== undefined) {
		expense.description = description.trim();
	}

	if (category !== undefined) {
		expense.category = category.trim()
			? category.trim()
			: 'miscellaneous';
	}

	if (amount !== undefined) {
		expense.amount = parseFloat(amount);
		if (!expense.amount || expense.amount === 0) {
			throw new BadRequestError('Invalid Amount');
		}
	}

	await expense.save();
	res.status(StatusCodes.OK).json({
		success: true,
		expense: {
			id: expense._id,
			description: expense.description,
			amount: expense.amount,
			category: expense.category,
			createdAt: expense.createdAt
		}
	});
};

const deleteExpense = async (req, res) => {
	const { userId } = req.user;
	if (!userId) throw new UnauthenticatedError('Authentication Invalid');

	const expense = await Expense.findOneAndDelete({
		createdBy: userId,
		_id: req.params.id
	});

	if (!expense)
		throw new BadRequestError(
			`No expense with id ${req.params.id}`
		);

	res.status(StatusCodes.OK).json({
		success: true,
		message: `Deleted`
	});
};

const showAnalytics = async (req, res) => {
	let analytics = await Expense.aggregate([
		{
			$match: {
				createdBy: new mongoose.Types.ObjectId(
					req.user.userId
				)
			}
		},
		{
			$group: {
				_id: '$category',
				totalExpense: { $sum: '$amount' },
				expenseCount: { $count: {} }
			}
		},
		{ $sort: { expenseCount: 1, totalExpense: 1 } }
	]);

	// Format the result from the aggregation pipeline
	analytics = analytics.reduce((acc, curr) => {
		const { _id: title, expenseCount, totalExpense } = curr;
		acc.push({ [title]: { expenseCount, totalExpense } });
		return acc;
	}, []);

	// Add pagination
	const totalCount = analytics.length;

	const { page, numOfPages, limit } = pageLimitQuery(req, totalCount);

	const skip = (page - 1) * limit;

	analytics = analytics.slice(skip, skip + limit);

	res.status(200).json({
		success: true,
		analytics,
		page,
		count: analytics.length,
		totalCount,
		numOfPages
	});
};
module.exports = {
	getAllExpenses,
	getSingleExpense,
	createExpense,
	updateExpense,
	deleteExpense,
	showAnalytics
};

// if (description) {
// 	if (typeof description === 'string') {
// 		if (checkIfEmpty(description)) {
// 			throw new BadRequestError(
// 				'Fill out description field'
// 			);
// 		}
// 	}
// 	expense.description = description;
// }
// if (category) {
// 	expense.category = checkIfEmpty(category)
// 		? 'miscellaneous'
// 		: category;
// }
// if (amount) {
// 	if (checkIfValidNumber(amount)) {
// 		expense.amount = amount;
// 	} else {
// 		throw new BadRequestError('Invalid Amount');
// 	}
// }
