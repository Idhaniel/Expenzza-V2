const { StatusCodes } = require('http-status-codes');

const errorHandlingMiddleware = (err, req, res, next) => {
	let customError = {
		message: err?.message || 'Something went wrong',
		statusCode:
			err?.statusCode ||
			StatusCodes.INTERNAL_SERVER_ERROR
	};

	// Duplicate entries error
	if (err.code && err.code === 11000) {
		customError.statusCode = StatusCodes.CONFLICT;
		customError.message = `Oops! ${Object.values(
			err.keyValue
		)} is taken. Please choose another ${Object.keys(
			err.keyValue
		)}.`;
	}

	// Cast Error.
	// *** Typically handling errors encountered casting strings to mongoose ObjectId.
	// *** Potential source of cast error should be in '../utils/sanitizeInput checkIfValidNumber function'
	// *** Hopefully we don't encounter its cast error. Lol
	if (err.name === 'CastError') {
		// if (err.kind === "ObjectId") {
		customError.statusCode = StatusCodes.NOT_FOUND;
		customError.message = `No document with id: ${err.value} found`;
		// } else {
		// 	err.name = "ValidationError"
		// 	customError.statusCode = StatusCodes.BAD_REQUEST
		// 	customError.message = `Invalid value provided for field: ${err.path}`
		// }
	}

	return res.status(customError.statusCode).json({
		success: false,
		message: customError.message
	});
};

module.exports = errorHandlingMiddleware;
