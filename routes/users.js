// Routes for users
const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const ExpressError = require('../helpers/expressError');
const { validate } = require('jsonschema');
// const userSchemaNew = require('../schemas/jobSchemaNew');
// const userSchemaEdit = require('../schemas/jobSchemaEdit');

router.get('/hello', (req, res, next) => {
	res.json({ message: 'hello from users' });
})


// GET all users
// return array of users --> username, first_name, last_name, email
// return JSON { users: [ {userData}, ... ] }
router.get('/', async (req, res, next) => {
	try {
		const users = await User.all(req.query);
		return res.json({ users });
	}
	catch (err) {
		return next(err);
	}
})

// POST /
// Create new and return newly created user
// return JSON { user: user }
router.post('/', async (req, res, next) => {
	try {
		// const validation = validate(req.body, jobSchemaNew);
		// if (!validation.valid) throw new ExpressError(validation.errors.map(e => e.stack), 400);

		const user = await User.addNew(req.body);
		return res.status(201).json({ user });
	}
	catch (err) {
		return next(err);
	}
})

// GET [username]
// Returns single user found by username
// return JSON { user: userData }
router.get('/:username', async (req, res, next) => {
	try {
		const user = await User.getByUsername(req.params.username);
		return res.json({ user });
	}
	catch (err) {
		return next(err);
	}
})

// PATCH [username]
// Edit and return existing user
// return JSON { user: userData }
router.patch('/:username', async (req, res, next) => {
	try {
		// const validation = validate(req.body, jobSchemaEdit);
		// if (!validation.valid) throw new ExpressError(validation.errors.map(e => e.stack), 400);

		const user = await User.edit(req.params.username, req.body);
		return res.json({ user })
	}
	catch (err) {
		return next(err);
	}
})

// DELETE [username]
// Remove existing user and return message
// return JSON { message: "User deleted" }
router.delete('/:username', async (req, res, next) => {
	try {
		await User.delete(req.params.username);
		return res.json({ message: 'User deleted' });
	}
	catch (err) {
		return next(err);
	}
})

module.exports = router;