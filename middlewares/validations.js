const { body } = require('express-validator');
const { isStrongPassword } = require('validator');

const validCategories = [
	'groceries',
	'utilities',
	'rent',
	'transportation',
	'food',
	'entertainment',
	'healthcare',
	'education',
	'clothing',
	'travel',
	'gifts',
	'charity',
	'investments',
	'gambling',
	'personal care',
	'home improvement',
	'miscellaneous'
];

const validateEmail = () => {
	return [
		body('email', 'Please provide a valid email')
			.isEmail()
			.bail()
			.escape()
			.normalizeEmail()
	];
};

const validateUsername = () => {
	return [
		body('username', 'Username cannot be empty')
			.trim()
			.notEmpty()
			.bail()
			.matches(
				/^(?=.{3,})(?!_*[a-zA-Z0-9]{0,1}$)[a-zA-Z_][a-zA-Z0-9_]{2,}$/
			)
			.withMessage(
				`Username must contain at least 3 characters, begin with a letter or an underscore and contain at least two letters (and/or numbers)`
			)
			.escape()
	];
};

const validatePassword = () => {
	return [
		body('password', 'Password cannot be empty')
			.custom((value) => !/^\s*$/.test(value))
			.trim()
			.notEmpty()
			.bail()
			.custom((value) => {
				const strong = isStrongPassword(value, {
					minLength: 6,
					minLowercase: 1,
					minUppercase: 0,
					minNumbers: 1,
					minSymbols: 0,
					returnScore: false
				});
				if (!strong) return false;
				return true;
			})
			.withMessage(
				'Password must be at least 6 characters long with at least one lowercase letter and one number'
			)
	];
};

const validateDescription = () => {
	return [
		body('description', 'Description is required')
			.trim()
			.notEmpty()
	];
};

const validateAmount = () => {
	return [
		body('amount')
			.trim()
			.notEmpty()
			.withMessage('Amount is required')
			.isNumeric()
			.withMessage('Amount must be a number')
			.custom((value) => parseFloat(value) !== 0)
			.withMessage('Amount cannot be zero')
	];
};

const validateCategory = () => {
	return [
		body('category')
			.optional()
			.trim()
			.custom((value) => {
				if (
					value &&
					!validCategories.includes(
						value
					)
				)
					return false;
				return true;
			})
			.withMessage('Invalid category value provided.')
	];
};

exports.validateExpenseCreation = () => {
	return [validateAmount(), validateCategory(), validateDescription()];
};

exports.validateExpenseUpdate = () => {
	return [
		body('amount')
			.if(body('amount').exists())
			.trim()
			.notEmpty()
			.withMessage('Amount is required')
			.isNumeric()
			.withMessage('Amount must be a number')
			.custom((value) => parseFloat(value) !== 0)
			.withMessage('Amount cannot be zero'),
		body('category')
			.if(body('category').exists())
			.trim()
			.custom((value) => {
				if (
					value &&
					!validCategories.includes(
						value
					)
				)
					return false;
				return true;
			})
			.withMessage('Invalid category value provided.'),
		body('description', 'Description is required')
			.if(body('description').exists())
			.trim()
			.notEmpty()
	];
};

exports.validateEmail = () => {
	return [validateEmail()];
};

exports.validatePassword = () => {
	return [validatePassword()];
};

exports.validateUsername = () => {
	return [validateUsername()];
};

exports.validateUserRegistration = () => {
	return [validateEmail(), validateUsername(), validatePassword()];
};
