const CustomAPIError = require('./CustomAPIError');
const { StatusCodes } = require('http-status-codes');

class ValidationError extends CustomAPIError {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
	}
}

module.exports = ValidationError;
