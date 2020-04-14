//Company class

const db = require('../db');
const ExpressError = require('../helpers/expressError');

class Company {

	constructor({ handle, name, num_employees, description, logo_url }) {
		this.handle = handle; 
		this.name = name; 
		this.num_employees = num_employees; 
		this.description = description; 
		this.logo_url = logo_url;
	  }

	static async hello() {
		return ([{ message: "hello" }, { message: "greetings" }]);
	}

	static async addNew({handle, name, num_employees, description, logo_url}) {
		const company = await db.query(`
			INSERT INTO companies (handle, name, num_employees, description, logo_url)
				VALUES ($1,$2,$3,$4,$5)
				RETURNING *`,
			[handle, name, num_employees, description, logo_url]);
		return company.rows[0];
	}

	static async all(searchParams) {

		let queryString = `SELECT handle, name, num_employees, description, logo_url FROM companies`;
		let results;

		// simple get all if no search options received
		if (Object.keys(searchParams).length === 0) {
			results = await db.query(queryString);
		}
		// add additional params to db query if they exist
		else {
			let { search = '', min_employees = 0, max_employees = 2147483647 } = searchParams;
			if (parseInt(min_employees) > parseInt(max_employees)) throw new ExpressError('Employee min/max search out of range', 404);
			queryString += ` WHERE name ILIKE $1 AND num_employees BETWEEN $2 AND $3`;
			results = await db.query(queryString, [`%${search}%`, min_employees, max_employees]);
		}

		if (!results.rows[0]) {
			throw new ExpressError('No companies found.', 404);
		}

		return results.rows.map(c => new Company(c));

	}

}

module.exports = Company;