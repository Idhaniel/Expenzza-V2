const BadRequestError = require('./BadRequestError');
const CustomAPIError = require('./CustomAPIError');
const NotFoundError = require('./NotFoundError');
const UnauthenticatedError = require('./UnauthenticatedError');
const ValidationError = require('./ValidationError');

module.exports = {
	BadRequestError,
	CustomAPIError,
	NotFoundError,
	UnauthenticatedError,
	ValidationError
};
