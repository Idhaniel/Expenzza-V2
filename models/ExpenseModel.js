const mongoose = require("mongoose")
const { checkIfValidNumber } = require("../utils/sanitizeInput")
const ExpenseSchema = new mongoose.Schema(
	{
		description: {
			type: String,
			trim: true,
			required: true,
		},
		amount: {
			type: Number,
			trim: true,
			required: true,
		},
		category: {
			type: String,
			trim: true,
			default: "Miscellaneous",
			lowercase: true,
			enum: {
				values: [
					"groceries",
					"utilities",
					"rent",
					"transportation",
					"food",
					"entertainment",
					"healthcare",
					"education",
					"clothing",
					"travel",
					"gifts",
					"charity",
					"investments",
					"gambling",
					"personal care",
					"home improvement",
					"miscellaneous",
				],
				message: "Invalid category value ({VALUE}) provided.",
				required: true,
			},
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model("Expense", ExpenseSchema)

// groceries, utilities, rent, transportation, food, entertainment, healthcare, education, clothing, travel, gifts, charity, investments, gambling, personal care, home improvement, miscellaneous
// For mockaroo
