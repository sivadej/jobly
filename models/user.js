//User class

const db = require('../db');
const ExpressError = require('../helpers/expressError');
const sqlForPartialUpdate = require('../helpers/partialUpdate');

class User {

	// static async addNew(data) {
	// 	const job = await db.query(`
	// 		INSERT INTO jobs (title, salary, equity, company_handle)
	// 			VALUES ($1,$2,$3,$4)
	// 			RETURNING id, title, salary, equity, company_handle, date_posted`,
	// 		[data.title, data.salary, data.equity, data.company_handle]);
	// 	return job.rows[0];
	// }

	// static async delete(id) {
	// 	const result = await db.query(`DELETE FROM jobs WHERE id = $1 RETURNING id`, [id]);
	// 	if (result.rows.length === 0) throw new ExpressError(`No company found with id ${id}`, 404);
	// }

	// static async getById(id) {
	// 	const job = await db.query(`
	// 		SELECT id, title, salary, equity, company_handle, date_posted 
	// 			FROM jobs
	// 			WHERE id = $1`,
	// 		[id]);

	// 	if (!job.rows[0]) {
	// 		throw new ExpressError(`No job found with id: ${id}`, 404);
	// 	}
	// 	return job.rows[0];
	// }

	// static async all(searchParams) {
	// 	let queryString = `SELECT id, title, company_handle FROM jobs ORDER BY date_posted DESC`;
	// 	let results;

	// 	// simple get all if no search options received
	// 	if (Object.keys(searchParams).length === 0) {
	// 		results = await db.query(queryString);
	// 	}
	// 	// add additional params to db query if they exist
	// 	else {
	// 		let { search = '', min_salary = 0, min_equity = 0 } = searchParams;
	// 		queryString = `SELECT id, title, company_handle FROM jobs WHERE title ILIKE $1 AND salary >= $2 AND equity >= $3 ORDER BY date_posted DESC`;
	// 		results = await db.query(queryString, [`%${search}%`, min_salary, min_equity]);
	// 	}

	// 	if (!results.rows[0]) {
	// 		throw new ExpressError('No companies found.', 404);
	// 	}
	// 	return results.rows;
	// }

	// static async edit(id, data) {
	// 	let generatedQuery = sqlForPartialUpdate('jobs', data, 'id', id);
	// 	let result = await db.query(generatedQuery.query, generatedQuery.values);
	// 	if (!result.rows[0]) {
	// 		throw new ExpressError(`No job found with id: ${id}`, 404);
	// 	}
	// 	return result.rows[0];
	// }

}

module.exports = User;