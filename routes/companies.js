// Routes for companies
const express = require('express');
const Company = require('../models/company');
const router = new express.Router();

router.get('/hello', (req, res, next) => {
	res.json({ message: 'hello from companies' });
})

// GET all companies
// optional params: search, min_employees, max_employees
// return JSON { companies: [ companyData, ... ] }
router.get('/', async (req, res, next) => {
	try {
		let companies = await Company.all(req.query);
		return res.json({ companies });
	}
	catch (err) {
		return next(err);
	}
})

// POST /companies
// Create new and return newly created company data
// return JSON { company: companyData }
router.post('/', async (req,res,next) => {
	try {
		const { handle, name, num_employees, description, logo_url } = req.body;
		let company = await Company.addNew({handle, name, num_employees, description, logo_url});
		return res.json({ company });
	}
	catch (err) {
		return next(err);
	}
})

module.exports = router;