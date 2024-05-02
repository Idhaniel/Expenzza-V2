const { isEmpty, isNumeric } = require("validator")

// Check if a string is empty
const checkIfEmpty = (input) => {
	if (input === undefined) return true
	if (input === null) return true
	return isEmpty(input.trim(), {
		ignore_whitespace: true,
	})
}

const checkIfValidNumber = (input) => {
	if (checkIfEmpty(input)) return false
	if (typeof input === "string") {
		input = input.trim()
	}
	try {
		input = Number(input)
	} catch (err) {
		return false
	}
	if (isNaN(input)) return false
	if (Number(input) <= 0) return false
	return true
}

module.exports = { checkIfEmpty, checkIfValidNumber }
