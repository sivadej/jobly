// integration tests for user routes

const request = require('supertest');
const app = require('../../app');
const db = require('../../db');

beforeEach(async () => {
	try {
		await db.query(`
			INSERT INTO users (username, password, first_name, last_name, email, photo_url)
				VALUES ($1,$2,$3,$4,$5,$6)
				RETURNING username, first_name, last_name, email, photo_url`,
			['testUser','password123','ftest','lname','email@test.com','http://test.com/test.jpg']);
	}
	catch (err) {
		console.error(err);
	}
})

afterEach(async () => {
	try {
		await db.query(`DELETE FROM users`);
	}
	catch (err) {
		console.error(err);
	}
})

describe('POST /users', () => {

	test('create new user, should not return password', async () => {
		const response = await request(app)
			.post('/users')
			.send({
				"username": "TempTest",
				"password": "temptest123",
				"first_name": "temp",
				"last_name": "tempuser",
				"email": "temp@test.com",
				"photo_url": "temp.jpg",
			});
		expect(response.statusCode).toBe(201);
		expect(response.body.user).toHaveProperty('username','TempTest');
		expect(response.body.user).not.toHaveProperty('password');
	})

	//test valiates json body

})

describe('GET /users', () => {

	test('gets list of 1 user', async () => {
		const response = await request(app).get('/users');
		expect(response.body.users).toHaveLength(1);
		expect(response.body.users[0]).toHaveProperty('username', 'testUser');
		expect(response.body.users[0]).not.toHaveProperty('password');
	})

})

describe('GET /users/:username', () => {

	test('gets user data by username', async () => {
		const dbID = await db.query(`SELECT username FROM users WHERE username='testUser'`);
		const username = dbID.rows[0].username;
		const response = await request(app).get(`/users/${username}`);
		expect(response.body).toHaveProperty('user');
		expect(response.body.user).toHaveProperty('username');
		expect(response.body.user).toHaveProperty('first_name');
		expect(response.body.user).not.toHaveProperty('password');
	})

	test('returns 404 error if company not found', async () => {
		const response = await request(app).get(`/users/0`);
		expect(response.statusCode).toBe(404);
	})

})

describe('PATCH /users/:username', () => {

	test('edits a user by username', async () => {
		const dbID = await db.query(`SELECT username FROM users WHERE username='testUser'`);
		const username = dbID.rows[0].username;
		const response = await request(app)
			.patch(`/users/${username}`)
			.send({
				email: 'changed@changed.com',
				photo_url: 'changed.jpeg',
			});
		expect(response.statusCode).toBe(200);
		expect(response.body.user.first_name).toBe('ftest');
		expect(response.body.user.email).toBe('changed@changed.com');
		expect(response.body.user).not.toHaveProperty('password');
	})

	//test valiates json body

	//test returns 404 if job id not found

})

// describe('DELETE /jobs/:id', ()=> {

// 	test('deletes job by id', async ()=> {
// 		const dbID = await db.query(`SELECT id FROM jobs WHERE title='tester'`);
// 		const id = dbID.rows[0].id;
// 		const response = await request(app).delete(`/jobs/${id}`);
// 		expect(response.statusCode).toBe(200);
// 		expect(response.body.message).toBe('Job deleted');
// 	})

// 	test('returns 404 error if job id not found', async ()=> {
// 		const response = await request(app)
// 		.delete('/jobs/0');
// 		expect(response.statusCode).toBe(404);
// 	})

// 	//test returns 404 if job id not found

// })

afterAll(async () => {
	await db.end();
})