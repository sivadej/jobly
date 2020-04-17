//User class

const db = require('../db');
const ExpressError = require('../helpers/expressError');
const sqlForPartialUpdate = require('../helpers/partialUpdate');

class User {

	static async addNew(data) {
		const user = await db.query(`
			INSERT INTO users (username, password, first_name, last_name, email, photo_url)
				VALUES ($1,$2,$3,$4,$5,$6)
				RETURNING username, first_name, last_name, email, photo_url`,
			[data.username, data.password, data.first_name, data.last_name, data.email, data.photo_url]);
		return user.rows[0];
	}

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

	static async all() {
		const users = await db.query(`
			SELECT username, first_name, last_name, email FROM users`);
		if (!users.rows[0]) {
			throw new ExpressError('No users found.', 404);
		}
		return users.rows;
	}

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