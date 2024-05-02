const createPayload = function (user) {
	return {
		userId: user._id,
		username: user.username,
		email: user.email,
		image: user.image
	};
};
module.exports = createPayload;
