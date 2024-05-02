const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {
	isEmail,
	isStrongPassword,
	matches,
	normalizeEmail
} = require('validator');

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: [true, 'Please provide an email'],
			trim: true,
			validate: {
				validator: (value) => isEmail(value),
				message: 'Please provide a valid email'
			}
		},
		username: {
			type: String,
			required: [true, 'Please provide a username'],
			trim: true,
			lowercase: true,

			validate: {
				validator: (value) =>
					matches(
						value,
						/^(?=.{3,})(?!_*[a-zA-Z0-9]{0,1}$)[a-zA-Z_][a-zA-Z0-9_]{2,}$/
					),
				message: 'Please provide a valid username'
			}
		},
		password: {
			type: String,
			required: [true, 'Please provide a password'],
			validate: {
				validator: (value) =>
					isStrongPassword(value, {
						minLength: 6,
						minLowercase: 1,
						minUppercase: 0,
						minNumbers: 1,
						minSymbols: 0,
						returnScore: false
					}),
				message: 'Please provide a strong password'
			}
		},
		image: {
			type: String,
			default: process.env.DEFAULT_IMAGE
		},
		imageID: {
			type: String,
			default: process.env.DEFAULT_IMAGE_ID
		}
	},
	{ timestamps: true }
);
UserSchema.index({ email: 1, username: 1 }, { unique: true });

UserSchema.pre('save', async function () {
	if (this.isModified('email')) {
		this.email = normalizeEmail(this.email);
	}
	if (!this.isModified('password')) return;
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.pre(
	'deleteOne',
	{ document: true, query: false },
	async function () {
		await this.model('Expense').deleteMany({
			createdBy: this._id
		});
	}
);

UserSchema.methods.verifyPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
