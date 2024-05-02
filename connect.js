const mongoose = require('mongoose');

const connectDB = async function (url, dbName) {
	return mongoose.connect(url, {
		dbName: dbName
	});
};

module.exports = connectDB;
