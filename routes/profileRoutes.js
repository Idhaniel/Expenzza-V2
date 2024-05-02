const express = require('express');
const router = express.Router();
const {
	validateUsername,
	validateEmail,
	validatePassword
} = require('../middlewares/validations');

const {
	showProfile,
	updateEmail,
	updatePassword,
	updateUsername,
	deleteAccount,
	uploadPfp,
	removeImage
} = require('../controllers/profileControllers');

router.get('/', showProfile);
router.delete('/', deleteAccount);
router.patch('/updateEmail', validateEmail(), updateEmail);
router.patch('/updateUsername', validateUsername(), updateUsername);
router.patch('/updatePassword', validatePassword(), updatePassword);
router.put('/uploadImage', uploadPfp);
router.delete('/deleteImage', removeImage);

module.exports = router;
