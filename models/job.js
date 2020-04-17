//Job class

const db = require('../db');
const ExpressError = require('../helpers/expressError');
const sqlForPartialUpdate = require('../helpers/partialUpdate');

class Job {

	static async addNew(data) {
		const job = await db.query(`
			INSERT INTO jobs (title, salary, equity, company_handle)
				VALUES ($1,$2,$3,$4)
				RETURNING id, title, salary, equity, company_handle, date_posted`,
			[data.title, data.salary, data.equity, data.company_handle]);
		return job.rows[0];
	}

	// static async delete(handle) {
	// 	const result = await db.query(`DELETE FROM companies WHERE handle = $1 RETURNING handle`, [handle]);
	// 	if (result.rows.length === 0) throw new ExpressError(`No company found with id ${handle}`, 404);
	// }

	// static async getByHandle(handle) {
	// 	const company = await db.query(`
	// 		SELECT handle, name, num_employees, description, logo_url 
	// 			FROM companies
	// 			WHERE handle = $1`,
	// 		[handle]);

	// 	if (!company.rows[0]) {
	// 		throw new ExpressError(`No company found with handle: ${handle}`, 404);
	// 	}
	// 	return company.rows[0];
	// }

	// static async all(searchParams) {
	// 	let queryString = `SELECT handle, name, num_employees, description, logo_url FROM companies`;
	// 	let results;

	// 	// simple get all if no search options received
	// 	if (Object.keys(searchParams).length === 0) {
	// 		results = await db.query(queryString);
	// 	}
	// 	// add additional params to db query if they exist
	// 	else {
	// 		let { search = '', min_employees = 0, max_employees = 2147483647 } = searchParams; // default max is largest possible 4-bit integer
	// 		if (parseInt(min_employees) > parseInt(max_employees)) throw new ExpressError('Invalid employee min/max range', 404);
	// 		queryString += ` WHERE name ILIKE $1 AND num_employees BETWEEN $2 AND $3`;
	// 		results = await db.query(queryString, [`%${search}%`, min_employees, max_employees]);
	// 	}

	// 	if (!results.rows[0]) {
	// 		throw new ExpressError('No companies found.', 404);
	// 	}
	// 	return results.rows;
	// }

	// static async edit(id, data) {
	// 	let generatedQuery = sqlForPartialUpdate('companies', data, 'handle', id);
	// 	let result = await db.query(generatedQuery.query, generatedQuery.values);
	// 	if (!result.rows[0]) {
	// 		throw new ExpressError(`No company found with handle: ${id}`, 404);
	// 	}
	// 	return result.rows[0];
	// }

}

module.exports = Job;