// Routes for companies
const express = require('express');
const Company = require('../models/company');
const router = new express.Router();

router.get('/hello', (req,res,next)=>{
	res.json({message:'hello from companies'});
})

// GET all companies
// optional params: search, min_employees, max_employees
// return JSON { companies: [ companyData, ... ] }
router.get('/', async (req,res,next)=>{
	try{
		let companies = await Company.all();
		return res.json({companies});
	}
	catch (err) {
		return next(err);
	}
})

module.exports = router;