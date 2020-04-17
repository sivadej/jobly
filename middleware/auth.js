// middleware for handing auth for routes

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

// authenticate user token
const authenticateToken = (req, res, next) => {
	try {
		const reqBodyToken = req.body._token;
		const payload = jwt.verify(reqBodyToken, SECRET_KEY);
		req.user = payload; // create a current user
		return next();
	}
	catch (err) {
		return next();
	}
}

// requires authenticated user
const isLoggedIn = (req, res, next) => {
	if (!req.user) return next({ status: 401, message: "Unauthorized user." });
	else return next();
}

// requires correct username
const isCorrectUser = (req, res, next) => {
	try {
		if (req.user.username === req.params.username) return next();
		else return next({ status: 401, message: "Unauthorized user." });
	}
	catch (err) {
		return next({ status: 401, message: "Unauthorized user." });
	}
}

module.exports = { authenticateToken, isLoggedIn, isCorrectUser };