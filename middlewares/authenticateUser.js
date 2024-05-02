const jwt = require("jsonwebtoken")
const { UnauthenticatedError } = require("../errors")
const { verifyToken } = require("../utils/jwt")

const authenticateUser = (req, res, next) => {
	const token = req.signedCookies.token
	if (!token) throw new UnauthenticatedError("Authentication Invalid")
	const payload = verifyToken(token)
	req.user = payload
	next()
}

module.exports = authenticateUser
