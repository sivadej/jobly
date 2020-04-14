//Company class

const db = require('../db');
const ExpressError = require('../helpers/expressError');

class Company{

	static async hello() {
		return([{message:"hello"}, {message:"greetings"}]);
	}

}

module.exports = Company;