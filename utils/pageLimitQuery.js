const { checkIfValidNumber } = require('./sanitizeInput');

const pageLimitQuery = (req, totalCount) => {
	let { page, limit } = req.query;
	if (checkIfValidNumber(page)) {
		page = Number(page);
	} else {
		page = 1;
	}
	if (checkIfValidNumber(limit)) {
		limit = Number(limit);
	} else {
		limit = 10;
	}
	let numOfPages = Math.ceil(totalCount / limit);
	if (numOfPages === 0) {
		numOfPages = 1;
	}
	if (page > numOfPages) {
		page = numOfPages;
	}
	return { page, numOfPages, limit };
};
module.exports = pageLimitQuery;
