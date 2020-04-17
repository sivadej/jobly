// Routes for jobs
const express = require('express');
const Job = require('../models/job');
const router = new express.Router();
const ExpressError = require('../helpers/expressError');
const { validate } = require('jsonschema');
// const companySchemaNew = require('../schemas/companySchemaNew');
// const companySchemaEdit = require('../schemas/companySchemaEdit');

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
		//const validation = validate(req.body, companySchemaNew);
		//if (!validation.valid) throw new ExpressError(validation.errors.map(e => e.stack), 400);

		const job = await Job.addNew(req.body);
		return res.status(201).json({ job });
	}
	catch (err) {
		return next(err);
	}
})

// // GET [handle]
// // Returns single company found by its handle id
// // return JSON { company: companyData }
// router.get('/:handle', async (req, res, next) => {
// 	try {
// 		const company = await Company.getByHandle(req.params.handle);
// 		return res.json({ company });
// 	}
// 	catch (err) {
// 		return next(err);
// 	}
// })

// // PATCH [handle]
// // Edit and return existing company
// // return JSON { company: companyData }
// router.patch('/:handle', async (req, res, next) => {
// 	try {
// 		const validation = validate(req.body, companySchemaEdit);
// 		if (!validation.valid) throw new ExpressError(validation.errors.map(e => e.stack), 400);

// 		const company = await Company.edit(req.params.handle, req.body);
// 		return res.json({ company })
// 	}
// 	catch (err) {
// 		return next(err);
// 	}
// })

// // DELETE [handle]
// // Remove existing company and return message
// // return JSON { message: "Company deleted" }
// router.delete('/:handle', async (req, res, next) => {
// 	try {
// 		await Company.delete(req.params.handle);
// 		return res.json({ message: 'Company deleted' });
// 	}
// 	catch (err) {
// 		return next(err);
// 	}
// })

module.exports = router;