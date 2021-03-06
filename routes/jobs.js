// Routes for jobs
const express = require('express');
const Job = require('../models/job');
const router = new express.Router();
const ExpressError = require('../helpers/expressError');
const { validate } = require('jsonschema');
const jobSchemaNew = require('../schemas/jobSchemaNew');
const jobSchemaEdit = require('../schemas/jobSchemaEdit');

router.get('/hello', (req, res, next) => {
	res.json({ message: 'hello from jobs' });
})

// GET all jobs
// all titles and company handles, ordered by most recently posted
// allow optional params: search, min_salary, min_equity
// return JSON { jobs: [ job, ... ] }
router.get('/', async (req, res, next) => {
	try {
		const jobs = await Job.all(req.query);
		return res.json({ jobs });
	}
	catch (err) {
		return next(err);
	}
})

// POST /
// Create new and return newly created company data
// return JSON { job: jobData }
router.post('/', async (req, res, next) => {
	try {
		const validation = validate(req.body, jobSchemaNew);
		if (!validation.valid) throw new ExpressError(validation.errors.map(e => e.stack), 400);

		const job = await Job.addNew(req.body);
		return res.status(201).json({ job });
	}
	catch (err) {
		return next(err);
	}
})

// GET [id]
// Returns single job found by its id
// return JSON { job: jobData }
router.get('/:id', async (req, res, next) => {
	try {
		const job = await Job.getById(req.params.id);
		return res.json({ job });
	}
	catch (err) {
		return next(err);
	}
})

// PATCH [id]
// Edit and return existing jobs
// return JSON { jobs: jobData }
router.patch('/:id', async (req, res, next) => {
	try {
		const validation = validate(req.body, jobSchemaEdit);
		if (!validation.valid) throw new ExpressError(validation.errors.map(e => e.stack), 400);

		const job = await Job.edit(req.params.id, req.body);
		return res.json({ job })
	}
	catch (err) {
		return next(err);
	}
})

// DELETE [id]
// Remove existing job and return message
// return JSON { message: "Job deleted" }
router.delete('/:id', async (req, res, next) => {
	try {
		await Job.delete(req.params.id);
		return res.json({ message: 'Job deleted' });
	}
	catch (err) {
		return next(err);
	}
})

module.exports = router;