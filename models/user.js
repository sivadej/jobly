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

	static async delete(username) {
		const result = await db.query(`DELETE FROM users WHERE username = $1 RETURNING username`, [username]);
		if (result.rows.length === 0) throw new ExpressError(`User not found: ${username}`, 404);
	}

	static async getByUsername(username) {
		const user = await db.query(`
			SELECT username, first_name, last_name, email, photo_url 
				FROM users
				WHERE username = $1`,
			[username]);

		if (!user.rows[0]) {
			throw new ExpressError(`Username not found: ${username}`, 404);
		}
		return user.rows[0];
	}

	static async all() {
		const users = await db.query(`
			SELECT username, first_name, last_name, email FROM users`);
		if (!users.rows[0]) {
			throw new ExpressError('No users found.', 404);
		}
		return users.rows;
	}

	static async edit(username, data) {
		let generatedQuery = sqlForPartialUpdate('users', data, 'username', username);
		let result = await db.query(generatedQuery.query, generatedQuery.values);
		if (!result.rows[0]) {
			throw new ExpressError(`User not found: ${username}`, 404);
		}
		delete result.rows[0].password;
		return result.rows[0];
	}

}

module.exports = User;