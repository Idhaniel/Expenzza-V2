const express = require('express');

const {
	getAllExpenses,
	createExpense,
	getSingleExpense,
	updateExpense,
	deleteExpense,
	showAnalytics
} = require('../controllers/expenseControllers');
const {
	validateExpenseCreation,
	validateExpenseUpdate
} = require('../middlewares/validations');

const router = express.Router();

router.route('/')
	.get(getAllExpenses)
	.post(validateExpenseCreation(), createExpense);
router.route('/showAnalytics').get(showAnalytics);
router.route('/:id')
	.get(getSingleExpense)
	.patch(validateExpenseUpdate(), updateExpense)
	.delete(deleteExpense);

module.exports = router;
