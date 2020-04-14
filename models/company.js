//Company class

const db = require('../db');
const ExpressError = require('../helpers/expressError');

class Company{

	static async hello() {
		return([{message:"hello"}, {message:"greetings"}]);
	}

	static async all() {
		const results = await db.query(
			`SELECT handle, name, num_employees, description, logo_url
				FROM companies`
		)
		if (!results.rows[0]) {
			throw new ExpressError('No companies found.', 404);
		}
		return results.rows.map(c => ({
			handle: c.handle,
			name: c.name,
			num_employees: c.num_employees,
			description: c.description,
			logo_url: c.logo_url,
		}));
	}

}

module.exports = Company;