require('express-async-errors');

const express = require('express');
const app = express();

const morgan = require('morgan');
const connectDB = require('./connect');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const { v2: cloudinary } = require('cloudinary');

const authRouter = require('./routes/authRoutes');
const profileRouter = require('./routes/profileRoutes');
const expenseRouter = require('./routes/expenseRoutes');

const authenticateUser = require('./middlewares/authenticateUser');
const notFoundMiddleware = require('./middlewares/notFoundMiddleware');
const errorHandlingMiddleware = require('./middlewares/errorHandlingMiddleware');

require('dotenv').config();

app.get('/', (req, res) => {
	res.send('<h1>Expenzza V2</h1>');
});

// Routes and Middlewares
app.use(cookieParser(process.env.PRIVATEKEY));
app.use(morgan('tiny'));
app.use(express.static('./public'));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profile', authenticateUser, profileRouter);
app.use('/api/v1/expenses', authenticateUser, expenseRouter);

app.use(notFoundMiddleware);
app.use(errorHandlingMiddleware);

const start = async function () {
	await connectDB(process.env.MONGO_URL, process.env.MONGO_DBNAME);
	app.listen(process.env.PORT || 5000, () => {
		console.log(`SET...`);
	});
};
start();
