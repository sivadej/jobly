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

// // GET [id]
// // Returns single job found by its id
// // return JSON { job: jobData }
// router.get('/:id', async (req, res, next) => {
// 	try {
// 		const job = await Job.getById(req.params.id);
// 		return res.json({ job });
// 	}
// 	catch (err) {
// 		return next(err);
// 	}
// })

// // PATCH [id]
// // Edit and return existing jobs
// // return JSON { jobs: jobData }
// router.patch('/:id', async (req, res, next) => {
// 	try {
// 		const validation = validate(req.body, jobSchemaEdit);
// 		if (!validation.valid) throw new ExpressError(validation.errors.map(e => e.stack), 400);

// 		const job = await Job.edit(req.params.id, req.body);
// 		return res.json({ job })
// 	}
// 	catch (err) {
// 		return next(err);
// 	}
// })

// // DELETE [id]
// // Remove existing job and return message
// // return JSON { message: "Job deleted" }
// router.delete('/:id', async (req, res, next) => {
// 	try {
// 		await Job.delete(req.params.id);
// 		return res.json({ message: 'Job deleted' });
// 	}
// 	catch (err) {
// 		return next(err);
// 	}
// })

module.exports = router;