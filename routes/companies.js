// Routes for companies
const express = require('express');
const Company = require('../models/company');
const router = new express.Router();
const ExpressError = require('../helpers/expressError');
const { validate } = require('jsonschema');
const companySchemaNew = require('../schemas/companySchemaNew');
const companySchemaEdit = require('../schemas/companySchemaEdit');

router.get('/hello', (req, res, next) => {
	res.json({ message: 'hello from companies' });
})

// GET all companies
// optional params: search, min_employees, max_employees
// return JSON { companies: [ companyData, ... ] }
router.get('/', async (req, res, next) => {
	try {
		const companies = await Company.all(req.query);
		return res.json({ companies });
	}
	catch (err) {
		return next(err);
	}
})

// POST /
// Create new and return newly created company data
// return JSON { company: companyData }
router.post('/', async (req, res, next) => {
	try {
		const validation = validate(req.body, companySchemaNew);
		if (!validation.valid) throw new ExpressError(validation.errors.map(e => e.stack), 400);

		const company = await Company.addNew(req.body);
		return res.status(201).json({ company });
	}
	catch (err) {
		return next(err);
	}
})

// GET [handle]
// Returns single company found by its handle id
// return JSON { company: companyData }
router.get('/:handle', async (req, res, next) => {
	try {
		const company = await Company.getByHandle(req.params.handle);
		return res.json({ company });
	}
	catch (err) {
		return next(err);
	}
})

// PATCH [handle]
// Edit and return existing company
// return JSON { company: companyData }
router.patch('/:handle', async (req, res, next) => {
	try {
		const validation = validate(req.body, companySchemaEdit);
		if (!validation.valid) throw new ExpressError(validation.errors.map(e => e.stack), 400);

		const company = await Company.edit(req.params.handle, req.body);
		return res.json({ company })
	}
	catch (err) {
		return next(err);
	}
})

// DELETE [handle]
// Remove existing company and return message
// return JSON { message: "Company deleted" }
router.delete('/:handle', async (req, res, next) => {
	try {
		await Company.delete(req.params.handle);
		return res.json({ message: 'Company deleted' });
	}
	catch (err) {
		return next(err);
	}
})

module.exports = router;